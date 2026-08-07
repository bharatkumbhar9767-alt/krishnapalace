import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/krishnapalace?schema=public'
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Clean existing data
  await prisma.roomAmenity.deleteMany()
  await prisma.amenity.deleteMany()
  await prisma.roomImage.deleteMany()
  await prisma.room.deleteMany()
  await prisma.roomCategory.deleteMany()
  
  // Create Categories
  const deluxeCategory = await prisma.roomCategory.create({
    data: {
      name: 'Deluxe Suite',
      description: 'Spacious suite with city views and premium amenities.',
      basePrice: 150,
      capacity: 2,
    },
  })

  const execCategory = await prisma.roomCategory.create({
    data: {
      name: 'Executive Room',
      description: 'Perfect for business travelers with a dedicated workspace.',
      basePrice: 120,
      capacity: 2,
    },
  })

  const familyCategory = await prisma.roomCategory.create({
    data: {
      name: 'Family Suite',
      description: 'Large suite designed for families, featuring two bedrooms.',
      basePrice: 250,
      capacity: 4,
    },
  })

  // Create Amenities
  const wifi = await prisma.amenity.create({ data: { name: 'Free WiFi', icon: 'wifi' } })
  const tv = await prisma.amenity.create({ data: { name: 'Smart TV', icon: 'tv' } })
  const pool = await prisma.amenity.create({ data: { name: 'Pool Access', icon: 'pool' } })

  // Create Rooms
  const room101 = await prisma.room.create({
    data: {
      roomNumber: '101',
      categoryId: deluxeCategory.id,
      status: 'AVAILABLE',
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
            isPrimary: true,
          }
        ]
      },
      amenities: {
        create: [
          { amenityId: wifi.id },
          { amenityId: tv.id },
        ]
      }
    }
  })

  const room201 = await prisma.room.create({
    data: {
      roomNumber: '201',
      categoryId: execCategory.id,
      status: 'AVAILABLE',
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
            isPrimary: true,
          }
        ]
      }
    }
  })

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
