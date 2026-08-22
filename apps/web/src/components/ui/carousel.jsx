import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// -------------------------------------------------------------------
// Simple carousel built with plain useRef + scroll — no Embla,
// no callback-refs that call setState, so no infinite render loop.
// -------------------------------------------------------------------

const CarouselContext = React.createContext(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) throw new Error("useCarousel must be used within a <Carousel />")
  return context
}

const Carousel = React.forwardRef(
  ({ orientation = "horizontal", opts, className, children, ...props }, ref) => {
    const scrollRef = React.useRef(null)
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(true)

    const loop = opts?.loop ?? false

    const updateScrollState = React.useCallback(() => {
      const el = scrollRef.current
      if (!el) return
      if (orientation === "horizontal") {
        setCanScrollPrev(loop || el.scrollLeft > 2)
        setCanScrollNext(loop || el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
      } else {
        setCanScrollPrev(loop || el.scrollTop > 2)
        setCanScrollNext(loop || el.scrollTop < el.scrollHeight - el.clientHeight - 2)
      }
    }, [orientation, loop])

    const scrollPrev = React.useCallback(() => {
      const el = scrollRef.current
      if (!el) return
      const size = orientation === "horizontal" ? el.clientWidth : el.clientHeight
      if (orientation === "horizontal") {
        el.scrollBy({ left: -size, behavior: "smooth" })
      } else {
        el.scrollBy({ top: -size, behavior: "smooth" })
      }
    }, [orientation])

    const scrollNext = React.useCallback(() => {
      const el = scrollRef.current
      if (!el) return
      const size = orientation === "horizontal" ? el.clientWidth : el.clientHeight
      if (orientation === "horizontal") {
        el.scrollBy({ left: size, behavior: "smooth" })
      } else {
        el.scrollBy({ top: size, behavior: "smooth" })
      }
    }, [orientation])

    const handleKeyDown = React.useCallback((event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault()
        scrollNext()
      }
    }, [scrollPrev, scrollNext])

    // Initialise scroll-state once the ref is populated
    React.useEffect(() => {
      const el = scrollRef.current
      if (!el) return
      updateScrollState()
      el.addEventListener("scroll", updateScrollState, { passive: true })
      return () => el.removeEventListener("scroll", updateScrollState)
    }, [updateScrollState])

    const contextValue = React.useMemo(() => ({
      scrollRef,
      orientation,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
    }), [orientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext])

    return (
      <CarouselContext.Provider value={contextValue}>
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { scrollRef, orientation } = useCarousel()

  return (
    <div
      ref={scrollRef}
      className="overflow-hidden"
      style={{ scrollSnapType: orientation === "horizontal" ? "x mandatory" : "y mandatory" }}
    >
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      style={{ scrollSnapAlign: "start" }}
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    )
  }
)
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    )
  }
)
CarouselNext.displayName = "CarouselNext"

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext }
