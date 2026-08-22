import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Download, MessageCircle, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// 6 Durations + address optional field
const DURATIONS = ['1 Hour', '2 Hours', '3 Hours', '3+ Hours', '24 Hours', 'Overnight'];
const WA_NUMBER = "917057998449"; 

const PosBillingTab = () => {
  const [rooms, setRooms] = useState([]);
  const [roomPricing, setRoomPricing] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingBills, setFetchingBills] = useState(true);
  const billPdfRef = useRef(null);

  // Form State - Removed Date/Time pickers, added Address
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    roomId: '',
    duration: '',
    additionalCharges: 0,
    discount: 0
  });

  // Calculated State
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const initData = async () => {
      try {
        const roomsData = await pb.collection('rooms').getFullList({ sort: 'name', $autoCancel: false });
        const pricingData = await pb.collection('room_pricing').getFullList({ $autoCancel: false });
        setRooms(roomsData);
        setRoomPricing(pricingData);
        fetchBills();
      } catch (error) {
        toast.error('Failed to load data');
      }
    };
    initData();
  }, []);

  const fetchBills = async () => {
    setFetchingBills(true);
    try {
      const records = await pb.collection('bills').getList(1, 50, { 
        sort: '-created',
        expand: 'roomId',
        $autoCancel: false 
      });
      setBills(records.items);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch previous bills');
    } finally {
      setFetchingBills(false);
    }
  };

  // Recalculate totals when inputs change
  useEffect(() => {
    const room = rooms.find(r => r.id === formData.roomId);
    setSelectedRoom(room);

    let calcSubtotal = 0;
    if (formData.roomId && formData.duration) {
      const pricing = roomPricing.find(p => p.roomId === formData.roomId && p.duration === formData.duration);
      calcSubtotal = pricing ? pricing.price : (room?.basePrice || 0);
    }
    setSubtotal(calcSubtotal);
    
    const add = parseFloat(formData.additionalCharges) || 0;
    const disc = parseFloat(formData.discount) || 0;
    setTotal(Math.max(0, calcSubtotal + add - disc));
  }, [formData, rooms, roomPricing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateBillNumber = async () => {
    try {
      const records = await pb.collection('bills').getList(1, 1, { sort: '-created', $autoCancel: false });
      if (records.items.length === 0) return 'BILL001';
      const lastBill = records.items[0].billNumber;
      const numMatch = lastBill.match(/\d+$/);
      if (numMatch) {
        const nextNum = parseInt(numMatch[0]) + 1;
        return `BILL${nextNum.toString().padStart(3, '0')}`;
      }
      return `BILL${Date.now().toString().slice(-4)}`;
    } catch {
      return `BILL${Date.now().toString().slice(-4)}`;
    }
  };

  const generatePDF = async (billRecord, roomName) => {
    try {
      const element = billPdfRef.current;
      if (!element) return;
      
      element.style.display = 'block';
      
      document.getElementById('pdf-bill-num').innerText = billRecord.billNumber;
      document.getElementById('pdf-date').innerText = new Date(billRecord.billDate).toLocaleDateString();
      document.getElementById('pdf-name').innerText = billRecord.customerName;
      document.getElementById('pdf-phone').innerText = billRecord.customerPhone;
      document.getElementById('pdf-address').innerText = formData.address || 'N/A';
      document.getElementById('pdf-room').innerText = roomName || 'N/A';
      document.getElementById('pdf-dur').innerText = billRecord.duration;
      document.getElementById('pdf-sub').innerText = `Rs. ${billRecord.subtotal}`;
      document.getElementById('pdf-add').innerText = `Rs. ${billRecord.additionalCharges}`;
      document.getElementById('pdf-disc').innerText = `Rs. ${billRecord.discount}`;
      document.getElementById('pdf-tot').innerText = `Rs. ${billRecord.total}`;

      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${billRecord.billNumber}.pdf`);
      
      element.style.display = 'none';
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast.error("Could not generate PDF locally.");
    }
  };

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.roomId || !formData.duration) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const billNum = await generateBillNumber();
      
      // Auto-generate check in/out dates for schema requirements
      const inDate = new Date();
      let hoursToAdd = 1;
      if (formData.duration.includes('2')) hoursToAdd = 2;
      if (formData.duration.includes('3')) hoursToAdd = 3;
      if (formData.duration.includes('24') || formData.duration === 'Overnight') hoursToAdd = 24;
      const outDate = new Date(inDate.getTime() + hoursToAdd * 3600000);

      const billData = {
        billNumber: billNum,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        roomId: formData.roomId,
        duration: formData.duration,
        checkInDate: inDate.toISOString(),
        checkOutDate: outDate.toISOString(), 
        pricePerUnit: subtotal,
        subtotal: subtotal,
        additionalCharges: parseFloat(formData.additionalCharges) || 0,
        discount: parseFloat(formData.discount) || 0,
        total: total,
        billDate: inDate.toISOString(),
        status: 'Sent' // Immediately set to sent as we open WA
      };

      const record = await pb.collection('bills').create(billData, { $autoCancel: false });
      toast.success('Bill Generated Successfully!', { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> });
      
      await generatePDF(record, selectedRoom?.name);
      
      // Auto-send fallback via UI (wa.me)
      const custWa = formData.customerPhone.replace(/\D/g, '');
      const msg = encodeURIComponent(`Hello ${formData.customerName}, your bill (${billNum}) for Rs. ${total} at Hotel Krishna Palace has been generated. Thank you for staying with us!`);
      window.open(`https://wa.me/91${custWa}?text=${msg}`, '_blank');
      
      toast.success('Bill sent to customer on WhatsApp', { duration: 5000 });

      fetchBills();

      setFormData({
        ...formData,
        customerName: '',
        customerPhone: '',
        address: '',
        roomId: '',
        duration: '',
        additionalCharges: 0,
        discount: 0
      });
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to create bill');
    } finally {
      setLoading(false);
    }
  };

  const handleReDownload = async (bill) => {
    toast.info('Re-generating PDF...');
    await generatePDF(bill, bill.expand?.roomId?.name);
  };

  const resendWhatsApp = (bill) => {
    const custWa = bill.customerPhone.replace(/\D/g, '');
    const msg = encodeURIComponent(`Hello ${bill.customerName}, your bill (${bill.billNumber}) for Rs. ${bill.total} at Hotel Krishna Palace.`);
    window.open(`https://wa.me/91${custWa}?text=${msg}`, '_blank');
    toast.success('Opened WhatsApp to send message');
  };

  return (
    <div className="animate-fade-in">
      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-[hsl(var(--admin-card))] border p-1 rounded-xl">
          <TabsTrigger value="create" className="rounded-lg font-bold">Create New Bill</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg font-bold">Previous Bills</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border shadow-sm rounded-3xl overflow-hidden bg-[hsl(var(--admin-card))]">
              <CardHeader className="bg-muted/30 border-b pb-5">
                <CardTitle className="text-xl flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> POS Billing Form</CardTitle>
                <CardDescription>Enter customer details and duration to generate bill</CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <form id="billing-form" onSubmit={handleGenerateBill} className="space-y-6">
                  
                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider border-b pb-2">Customer Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Customer Name *</Label>
                        <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} required placeholder="Full Name" className="h-12 bg-[hsl(var(--admin-bg))]" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerPhone">Phone Number *</Label>
                        <Input id="customerPhone" name="customerPhone" value={formData.customerPhone} onChange={handleChange} required placeholder="10-digit number" className="h-12 bg-[hsl(var(--admin-bg))]" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address (Optional)</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Customer address for invoice" className="h-12 bg-[hsl(var(--admin-bg))]" />
                      </div>
                    </div>
                  </div>

                  {/* Room Selection */}
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider border-b pb-2">Stay Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Select Room *</Label>
                        <Select value={formData.roomId} onValueChange={(val) => handleSelectChange('roomId', val)} required>
                          <SelectTrigger className="h-12 bg-[hsl(var(--admin-bg))]">
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                          <SelectContent>
                            {rooms.map(r => (
                              <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Select Duration *</Label>
                        <Select value={formData.duration} onValueChange={(val) => handleSelectChange('duration', val)} required>
                          <SelectTrigger className="h-12 bg-[hsl(var(--admin-bg))]">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            {DURATIONS.map(d => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Adjustments */}
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider border-b pb-2">Pricing Adjustments</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="additionalCharges">Additional Charges (₹)</Label>
                        <Input id="additionalCharges" name="additionalCharges" type="number" min="0" value={formData.additionalCharges} onChange={handleChange} className="h-12 bg-[hsl(var(--admin-bg))]" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discount">Discount (₹)</Label>
                        <Input id="discount" name="discount" type="number" min="0" value={formData.discount} onChange={handleChange} className="h-12 bg-[hsl(var(--admin-bg))]" />
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Total Calculation Card */}
            <Card className="border shadow-md rounded-3xl overflow-hidden bg-[hsl(var(--admin-card))] h-fit sticky top-24">
              <CardHeader className="bg-primary border-b pb-5">
                <CardTitle className="text-xl flex items-center justify-center gap-2 text-primary-foreground">
                  <Calculator className="w-5 h-5" /> Bill Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-bold">{formData.duration || '-'}</span>
                </div>
                <div className="flex justify-between text-base pt-3 border-t border-border/50">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold text-foreground">₹ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Additions</span>
                  <span className="font-bold text-emerald-600">+ ₹ {parseFloat(formData.additionalCharges || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-bold text-destructive">- ₹ {parseFloat(formData.discount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-extrabold pt-6 border-t-2 border-primary/20 text-primary">
                  <span>Total</span>
                  <span>₹ {total.toFixed(2)}</span>
                </div>

                <Button 
                  type="submit" 
                  form="billing-form" 
                  className="w-full mt-8 h-16 text-lg font-bold shadow-xl rounded-2xl transition-all active:scale-[0.98]"
                  disabled={loading || total <= 0}
                >
                  {loading ? 'Generating...' : 'Generate & Send Bill'}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4 leading-relaxed">
                  PDF will be downloaded automatically and WhatsApp will open to send it to the customer.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border shadow-sm rounded-3xl overflow-hidden bg-[hsl(var(--admin-card))]">
            <CardHeader className="border-b pb-5 bg-muted/20">
              <CardTitle className="text-xl">Recent Bills</CardTitle>
              <CardDescription>View, download and share previously generated bills.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {fetchingBills ? (
                <div className="p-12 text-center text-muted-foreground">Loading bills...</div>
              ) : bills.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">No bills generated yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="py-4">Bill No.</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Room & Duration</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bills.map(bill => (
                        <TableRow key={bill.id}>
                          <TableCell className="font-bold text-primary py-4">{bill.billNumber}</TableCell>
                          <TableCell className="font-medium">{new Date(bill.billDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground">{bill.customerName}</span>
                              <span className="text-xs text-muted-foreground">{bill.customerPhone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold">{bill.expand?.roomId?.name || 'N/A'}</span>
                              <span className="text-xs text-muted-foreground bg-muted w-fit px-2 py-0.5 rounded mt-1">{bill.duration}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-extrabold text-base">₹ {bill.total}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-3">
                              <Button variant="outline" size="sm" className="rounded-xl shadow-sm hover:border-primary hover:text-primary" title="Download PDF" onClick={() => handleReDownload(bill)}>
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-xl shadow-sm text-[hsl(var(--whatsapp))] border-[hsl(var(--whatsapp))/20] hover:bg-[hsl(var(--whatsapp))/10] hover:border-[hsl(var(--whatsapp))]"
                                title="Resend via WhatsApp" 
                                onClick={() => resendWhatsApp(bill)}
                              >
                                <MessageCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hidden Div for PDF Generation */}
      <div ref={billPdfRef} style={{ display: 'none', position: 'fixed', top: '-9999px', left: '0', width: '800px', backgroundColor: 'white', padding: '50px', color: 'black', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #000', paddingBottom: '25px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#004d40' }}>HOTEL KRISHNA PALACE</h1>
          <p style={{ margin: '5px 0', fontSize: '15px' }}>Old Mumbai Pune Highway, Opp HDFC Bank, Dehu Road, Pune - 412101</p>
          <p style={{ margin: '5px 0', fontSize: '15px' }}><strong>WhatsApp:</strong> +91 7057998449 | <strong>Email:</strong> sharathsmumbai@gmail.com</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ width: '48%' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', borderBottom: '1px solid #ccc', display: 'inline-block', paddingBottom: '5px' }}>Billed To</h3>
            <p style={{ margin: '8px 0', fontSize: '16px' }}><strong>Name:</strong> <span id="pdf-name"></span></p>
            <p style={{ margin: '8px 0', fontSize: '16px' }}><strong>Phone:</strong> <span id="pdf-phone"></span></p>
            <p style={{ margin: '8px 0', fontSize: '16px' }}><strong>Address:</strong> <span id="pdf-address"></span></p>
          </div>
          <div style={{ width: '48%', textAlign: 'right' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', borderBottom: '1px solid #ccc', display: 'inline-block', paddingBottom: '5px' }}>Invoice Details</h3>
            <p style={{ margin: '8px 0', fontSize: '16px' }}><strong>Invoice No:</strong> <span id="pdf-bill-num"></span></p>
            <p style={{ margin: '8px 0', fontSize: '16px' }}><strong>Date:</strong> <span id="pdf-date"></span></p>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', borderBottom: '1px solid #ccc', display: 'inline-block', paddingBottom: '5px' }}>Stay Details</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#004d40', color: 'white' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', border: '1px solid #ddd', fontSize: '16px' }} id="pdf-room"></td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right', fontSize: '16px' }} id="pdf-dur"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ width: '50%', marginLeft: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '16px' }}>Subtotal:</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'right', fontSize: '16px' }} id="pdf-sub"></td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '16px' }}>Additional Charges:</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'right', fontSize: '16px' }} id="pdf-add"></td>
              </tr>
              <tr>
                <td style={{ padding: '12px', borderBottom: '2px solid #000', fontSize: '16px' }}>Discount:</td>
                <td style={{ padding: '12px', borderBottom: '2px solid #000', textAlign: 'right', fontSize: '16px' }} id="pdf-disc"></td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '20px 12px', fontWeight: 'bold', fontSize: '24px', color: '#004d40' }}>Total Amount:</td>
                <td style={{ padding: '20px 12px', fontWeight: 'bold', fontSize: '24px', textAlign: 'right', color: '#004d40' }} id="pdf-tot"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '80px', textAlign: 'center', fontSize: '14px', color: '#666', borderTop: '1px solid #eee', paddingTop: '30px' }}>
          <p style={{ margin: '5px 0' }}>Thank you for choosing Hotel Krishna Palace. We hope to welcome you again!</p>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>This is a computer generated invoice and does not require a signature.</p>
        </div>
      </div>
    </div>
  );
};

export default PosBillingTab;