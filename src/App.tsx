import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react"
const importedImages = import.meta.glob("/src/imports/*", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>

function getImageAsset(fileName: string) {
  const asset = importedImages[`/src/imports/${fileName}`]

  if (!asset) {
    throw new Error(`Missing gallery asset: ${fileName}`)
  }

  return asset
}

function getImageAlt(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b(copy|converted|edit|page)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
}

const galleryFiles = [
  [
    "TYP_PLAN_-_Copy_-_Copy-3.jpg",
    "GROUND_FLOOR-2.jpg",
    "UNITS-3.jpg",
    "AGRE.jpg",
    "SECTIONS-2.jpg",
    "DSCF9694-5.jpg",
    "DSCF9705-4.jpg",
    "DSCF9707-5.jpg",
    "IMAGE-2.jpg",
  ],
  [
    "DSCF99011a.jpg",
    "IMG_9704a.jpg",
    "DSCF7595a.jpg",
    "SITE_PLAN1a.jpg",
    "A1.1a.jpg",
    "A1.2a.jpg",
    "A1.3a.jpg",
    "A3.2a.jpg",
    "A3.1a.jpg",
    "A2a.jpg",
  ],
  [
    "PATTERNS_Page_4.jpg",
    "DSCF8460.jpg",
    "DSCF8461.jpg",
    "DSCF8467.jpg",
    "OBJECTS_Page_2.jpg",
    "INTERSECTION__Converted__Page_1.jpg",
    "ORTHO_Page_5.jpg",
    "ORTHO_Page_6.jpg",
    "IMG_6572.jpg",
    "IMG_6610.jpg",
    "BRICOLAGE_DIAGRAM_Page_7.jpg",
  ],
  [
    "EAST_ELEVATION.jpg",
    "SOUTH_ELEVATION.jpg",
    "WEST_ELEVATION.jpg",
    "RENDER_1-1.jpg",
    "RENDER4-1.jpg",
    "RENDER_2-1.jpg",
    "RENDER_3-1.jpg",
    "SITE-1.jpg",
    "HOUSE_IN_SARGODHA_PRESENTATION2-1.jpeg",
    "FRAMING_PLANS_1.jpg",
    "FRAMING_PLANS_2.jpg",
    "SECTION1.jpg",
    "SECTION2.jpg",
  ],
  [
    "PRIMARY_PLAN.jpg",
    "GROUND_PLAN.jpg",
    "SECTION_2.jpg",
    "L1410835.jpg",
    "L1410871.jpg",
    "L1410852.jpg",
    "FRONT_RENDER.jpg",
    "MUSIC_ROOM_RENDER.jpg",
    "KKTCHEN_RENDER.jpg",
    "COURTYARD.jpg",
    "Brenner_12_3875_C.jpg",
    "IMG_6187.jpg",
  ],
  [
    "FEILDS.jpg",
    "SCROLL.jpg",
    "AREA_MAP.jpg",
    "KILN_SITE_PLAN.jpg",
    "GROUND_PLAN_KILN.jpg",
    "STU_REN.jpg",
    "STUDIO_SPREAD.jpg",
    "WORK_REN.jpg",
    "WORKSHOP_SPREAD.jpg",
  ],
  [
    "ELEVATIONS.jpg",
    "RENDERS.jpg",
    "SITE_ANALYSIS.jpg",
    "SKETCHES.jpg",
    "SECTION.jpg",
    "PARTI.jpg",
    "GROUND_FLOOR_PLAN-1.jpg",
    "PLANS_Page_1.jpg",
    "PLANS_Page_2.jpg",
    "PLANS_Page_3.jpg",
  ],
  ["IMG_4997.jpg", "ezgif-1702079d064445a1.gif"],
  [
    "IMAGE_1.jpg",
    "AXO_LIB.jpg",
    "RENDER_1-2.jpg",
    "RENDER_2-2.jpg",
    "GROUND_FLOOR_PLAN_400.jpg",
    "BASEMENT_PLAN_400.jpg",
    "Exploded_Axo_Library.jpg",
    "SECTION-1.jpg",
    "DETAIL.jpg",
    "RENDER.jpg",
  ],
  [
    "DSCF2075.jpg",
    "DSCF9767-Edit.jpg",
    "DSCF9770-Edit.jpg",
    "PLANS_1.jpg",
    "PLANS_2.jpg",
    "SECTION-2.jpg",
    "SECTION_Page_2.jpg",
    "SECTION_DETAILS_Page_4.jpg",
    "SECTION_DETAILS_Page_5.jpg",
    "RENDERS-1.jpg",
    "PROGRAM_DIAGRAM.jpg",
    "SKATEPARK_ISO.jpg",
    "FREIZE.jpg",
    "SKETCHES-1.jpg",
  ],
  [
    "Brasilia_RENDER1_FINAL_TOUCHES.jpg",
    "CHRISTMAS_RENDER.jpg",
    "SITE_PLAN_BRA.jpg",
    "BLOCK_DIAGRAM-01.jpg",
    "diagram-01.jpg",
  ],
] as const

const imageRows = galleryFiles.map((files) =>
  files.map((fileName) => ({
    src: getImageAsset(fileName),
    alt: getImageAlt(fileName),
  })),
)

type GalleryRowProps = {
  images: typeof imageRows[number]
  rowNumber: number
  onImageClick: (image: typeof imageRows[number][number]) => void
}

function GalleryRow({ images, rowNumber, onImageClick }: GalleryRowProps) {
  const galleryRef = useRef<HTMLElement>(null)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const scrollRow = (direction: -1 | 1) => {
    const gallery = galleryRef.current
    if (!gallery) return

    gallery.scrollBy({
      left: direction * gallery.clientWidth * 0.8,
      behavior: "smooth",
    })
  }

  return (
    <div className="mt-20">
      <section
        ref={galleryRef}
        data-gallery-row={rowNumber}
        aria-label={`Image gallery row ${rowNumber}`}
        className={`gallery-scrollbar overflow-x-auto overflow-y-hidden bg-transparent pt-4 pr-0 pb-8 pl-[calc(50vw-10rem)] select-none sm:pl-[calc(50vw-12rem)] ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onScroll={(event) => {
          const gallery = event.currentTarget
          const maxScroll = gallery.scrollWidth - gallery.clientWidth
          setScrollProgress(
            maxScroll > 0 ? (gallery.scrollLeft / maxScroll) * 100 : 0,
          )
        }}
        onPointerDown={(event) => {
          const gallery = galleryRef.current
          if (!gallery) return

          gallery.setPointerCapture(event.pointerId)
          dragStart.current = {
            x: event.clientX,
            scrollLeft: gallery.scrollLeft,
          }
          setIsDragging(true)
        }}
        onPointerMove={(event) => {
          const gallery = galleryRef.current
          if (!gallery || !isDragging) return

          gallery.scrollLeft =
            dragStart.current.scrollLeft - (event.clientX - dragStart.current.x)
        }}
        onPointerUp={(event) => {
          galleryRef.current?.releasePointerCapture(event.pointerId)
          setIsDragging(false)
        }}
        onPointerCancel={() => setIsDragging(false)}
      >
        <div className="relative flex w-max gap-x-[100px] gap-y-[400px] pr-[calc(50vw-10rem)] sm:pr-[calc(50vw-12rem)]">
          {images.map((image) => (
            <div
              key={image.src}
              className="relative z-10 w-80 flex-none sm:w-96"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="gallery-image aspect-square w-full object-cover"
                draggable={false}
              />
              <button
                type="button"
                className="accent-fade-text absolute top-full left-1/2 flex size-7 -translate-x-1/2 cursor-pointer items-center justify-center border-none bg-white p-0 text-[#15A84F]"
                aria-label={`Enlarge ${image.alt}`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => onImageClick(image)}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  aria-hidden="true"
                >
                  <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-8 mt-3 flex items-center gap-5 sm:mx-12">
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-1"
          aria-label={`Scroll gallery row ${rowNumber} left`}
          onClick={() => scrollRow(-1)}
        >
          <span className="block h-0 w-0 border-y-[6px] border-r-[10px] border-y-transparent border-r-[#15A84F]" />
        </button>
        <div className="relative h-3 flex-1" aria-hidden="true">
          <span
            className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#15A84F]"
            style={{ left: `${scrollProgress}%` }}
          />
        </div>
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-1"
          aria-label={`Scroll gallery row ${rowNumber} right`}
          onClick={() => scrollRow(1)}
        >
          <span className="block h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-[#15A84F]" />
        </button>
      </div>
    </div>
  )
}

function PhysicsSquare({ onClick }: { onClick: () => void }) {
  const squareRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const square = squareRef.current
    const firstImage = document.querySelector<HTMLImageElement>(
      '[data-gallery-row="1"] img',
    )
    if (!square || !firstImage) return

    const size = 40
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (reducedMotion) {
      const imageTop = Math.max(0, firstImage.getBoundingClientRect().top)
      square.style.opacity = "1"
      square.style.transform = `translate3d(${Math.max(
        0,
        window.innerWidth / 2 - size / 2,
      )}px, ${Math.max(0, imageTop - size)}px, 0)`
      return
    }

    let animationFrame = 0
    let x = Math.max(0, window.innerWidth / 2 - size / 2)
    let y = -size
    let velocityX = 145
    let velocityY = 0
    let rotation = 0
    let angularVelocity = 180
    let lastTime = performance.now()
    let lastFloor = Math.min(
      window.innerHeight,
      firstImage.getBoundingClientRect().top,
    )
    let lastScrollY = window.scrollY
    let pinned = false

    const addScrollImpulse = () => {
      const scrollDelta = window.scrollY - lastScrollY
      lastScrollY = window.scrollY

      if (!pinned && scrollDelta !== 0) {
        const impulse = Math.min(Math.abs(scrollDelta) * 10, 360)
        velocityY -= impulse
        velocityX +=
          Math.sign(scrollDelta) *
          Math.min(Math.abs(scrollDelta) * 3, 140) *
          (Math.round(window.scrollY) % 2 === 0 ? 1 : -1)
        angularVelocity +=
          Math.sign(scrollDelta) * Math.min(Math.abs(scrollDelta) * 12, 720)
      }
    }

    const animate = (time: number) => {
      const deltaTime = Math.min((time - lastTime) / 1000, 0.032)
      lastTime = time

      const floor = Math.min(
        window.innerHeight,
        firstImage.getBoundingClientRect().top,
      )

      if (floor <= size) {
        pinned = true
        y = 0
        velocityX = 0
        velocityY = 0
        angularVelocity = 0
        rotation = Math.round(rotation / 90) * 90
      } else if (pinned) {
        pinned = false
        velocityX = x > window.innerWidth / 2 ? -145 : 145
        velocityY = 0
        angularVelocity = velocityX > 0 ? 240 : -240
      }

      if (!pinned) {
        const floorVelocity = (floor - lastFloor) / Math.max(deltaTime, 0.001)

        velocityY += 1500 * deltaTime
        velocityX *= Math.exp(-0.12 * deltaTime)
        angularVelocity *= Math.exp(-1.1 * deltaTime)
        angularVelocity = Math.max(-300, Math.min(300, angularVelocity))
        x += velocityX * deltaTime
        y += velocityY * deltaTime
        rotation += angularVelocity * deltaTime

        const maxX = Math.max(0, window.innerWidth - size)
        if (x <= 0) {
          x = 0
          velocityX = Math.abs(velocityX) * 0.78
          rotation = Math.round(rotation / 90) * 90
          angularVelocity *= 0.18
        } else if (x >= maxX) {
          x = maxX
          velocityX = -Math.abs(velocityX) * 0.78
          rotation = Math.round(rotation / 90) * 90
          angularVelocity *= 0.18
        }

        if (y <= 0) {
          y = 0
          velocityY = Math.abs(velocityY) * 0.58
          rotation = Math.round(rotation / 90) * 90
          angularVelocity *= 0.18
        }

        if (y + size >= floor) {
          y = Math.max(0, floor - size)
          velocityY =
            -Math.abs(velocityY) * 0.58 + Math.min(floorVelocity * 0.8, 0)
          velocityX += floorVelocity * 0.06
          velocityX *= 0.97
          rotation = Math.round(rotation / 90) * 90
          angularVelocity *= 0.9

          if (Math.abs(velocityY) < 35 && Math.abs(floorVelocity) < 5) {
            velocityY = 0
          }
        }
      }

      lastFloor = floor
      square.style.opacity = "1"
      square.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`
      animationFrame = requestAnimationFrame(animate)
    }

    window.addEventListener("scroll", addScrollImpulse, { passive: true })
    animationFrame = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("scroll", addScrollImpulse)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <button
      type="button"
      ref={squareRef}
      className="accent-fade-background fixed top-0 left-0 z-30 flex size-10 cursor-pointer items-center justify-center border-0 bg-[#15A84F] p-0 text-lg text-white opacity-0 will-change-transform [font-family:'Courier_New',Courier,monospace]"
      aria-label="Open CV"
      onClick={onClick}
    >
      CV
    </button>
  )
}

export default function App() {
  const [selectedImage, setSelectedImage] =
    useState<typeof imageRows[number][number] | null>(null)
  const [isCvOpen, setIsCvOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [magnifier, setMagnifier] = useState<{
    x: number
    y: number
    imageWidth: number
    imageHeight: number
  } | null>(null)

  const updateMagnifier = (event: ReactPointerEvent<HTMLImageElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = Math.min(Math.max(event.clientX - bounds.left, 0), bounds.width)
    const y = Math.min(Math.max(event.clientY - bounds.top, 0), bounds.height)

    setMagnifier({
      x,
      y,
      imageWidth: bounds.width,
      imageHeight: bounds.height,
    })
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    setMagnifier(null)
  }

  const navigateImage = (direction: -1 | 1) => {
    if (!selectedImage) return

    const gallery = imageRows.find((images) =>
      images.some((image) => image.src === selectedImage.src),
    )
    if (!gallery) return

    const currentIndex = gallery.findIndex(
      (image) => image.src === selectedImage.src,
    )
    const nextIndex =
      (currentIndex + direction + gallery.length) % gallery.length

    setMagnifier(null)
    setSelectedImage(gallery[nextIndex])
  }

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 20)

    updateHeader()
    window.addEventListener("scroll", updateHeader, { passive: true })
    return () => window.removeEventListener("scroll", updateHeader)
  }, [])

  useEffect(() => {
    if (!selectedImage && !isCvOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null)
        setIsCvOpen(false)
        setMagnifier(null)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", closeOnEscape)
    }
  }, [selectedImage, isCvOpen])

  return (
    <main className="min-h-[200vh] bg-white pb-20 text-neutral-950">
      <PhysicsSquare onClick={() => setIsCvOpen(true)} />
      <header className="pointer-events-none sticky top-0 z-40 bg-transparent px-6 pt-[calc(max(env(safe-area-inset-top),2.75rem)+1.5rem)] pb-6 mix-blend-difference sm:px-10 sm:pt-10 sm:pb-10">
        <h1
          className={`sticky text-center text-2xl font-bold tracking-tight text-[#15A84F] invert transition-transform duration-300 [font-family:Helvetica,Arial,sans-serif] sm:text-3xl ${
            isScrolled ? "-translate-y-6 sm:-translate-y-10" : "translate-y-0"
          }`}
        >
          Jesper Brenner
        </h1>
      </header>

      {imageRows.map((images, index) => (
        <GalleryRow
          key={index}
          images={images}
          rowNumber={index + 1}
          onImageClick={setSelectedImage}
        />
      ))}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-6 backdrop-blur-md sm:p-12"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged image"
          onClick={closeLightbox}
        >
          <div
            className="relative inline-flex"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className={`popout-image max-h-[88vh] max-w-[92vw] touch-none object-contain shadow-2xl ${
                magnifier ? "cursor-none" : "cursor-zoom-in"
              }`}
              draggable={false}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId)
                updateMagnifier(event)
              }}
              onPointerMove={(event) => {
                if (magnifier) updateMagnifier(event)
              }}
              onPointerUp={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId)
                }
                setMagnifier(null)
              }}
              onPointerCancel={() => setMagnifier(null)}
            />
            {magnifier && (
              <div
                className="pointer-events-none absolute z-10 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-no-repeat shadow-2xl"
                style={{
                  left: magnifier.x,
                  top: magnifier.y,
                  backgroundImage: `url("${selectedImage.src}")`,
                  backgroundOrigin: "border-box",
                  backgroundPosition: `${160 - magnifier.x * 3}px ${
                    160 - magnifier.y * 3
                  }px`,
                  backgroundSize: `${magnifier.imageWidth * 3}px ${
                    magnifier.imageHeight * 3
                  }px`,
                }}
                aria-hidden="true"
              />
            )}
            <button
              type="button"
              className="accent-fade-text absolute top-full left-0 mt-3 flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-white text-[#15A84F] shadow-sm sm:fixed sm:top-1/2 sm:left-8 sm:mt-0 sm:-translate-y-1/2"
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation()
                navigateImage(-1)
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-7"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M16.619 4L2.763 12L16.619 20V4z" />
              </svg>
            </button>
            <button
              type="button"
              className="accent-fade-text absolute top-full right-0 mt-3 flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-white text-[#15A84F] shadow-sm sm:fixed sm:top-1/2 sm:right-8 sm:mt-0 sm:-translate-y-1/2"
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation()
                navigateImage(1)
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-7"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7.381 4L21.237 12L7.381 20V4z" />
              </svg>
            </button>
            <button
              type="button"
              className="accent-fade-text absolute right-0 bottom-full mb-3 flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-white text-[#15A84F] shadow-sm sm:fixed sm:top-10 sm:right-8 sm:bottom-auto sm:mb-0"
              aria-label="Close enlarged image"
              onClick={closeLightbox}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {isCvOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-6 backdrop-blur-md sm:items-start sm:px-12 sm:pt-10 sm:pb-12"
          role="dialog"
          aria-modal="true"
          aria-label="CV"
          onClick={() => setIsCvOpen(false)}
        >
          <div
            className="relative"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="aspect-square w-[min(82vh,92vw,900px)] bg-white shadow-2xl" />
            <button
              type="button"
              className="accent-fade-text absolute right-0 bottom-full mb-3 flex size-10 cursor-pointer items-center justify-center border-0 bg-white text-[#15A84F] shadow-sm sm:fixed sm:top-10 sm:right-10 sm:bottom-auto sm:mb-0"
              aria-label="Close CV"
              onClick={() => setIsCvOpen(false)}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
