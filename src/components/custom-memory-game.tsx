"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shuffle, Sun, Moon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cardData } from "@/data/cardData"
import Image from 'next/image'
import { WelcomePopin } from "@/components/ui/welcome-popin"

// Modify the preloadImages function
const preloadImages = (images: string[]): Promise<void> => {
  const loadImage = (src: string): Promise<void> =>
    new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });

  return Promise.all(images.map(loadImage)).then(() => {});
};

interface CardType {
  id: number
  image: string
  popupTitle: string
  popupDescription: string
  popupImage: string
  isFlipped: boolean
  isMatched: boolean
}

export function CustomMemoryGame() {
  const [cards, setCards] = useState<CardType[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [popupContent, setPopupContent] = useState({ title: "", description: "", image: "" })
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isWaiting, setIsWaiting] = useState(false)

  const initializeGame = () => {
    const shuffledCards = [...cardData, ...cardData]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        ...card,
        id: index,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(shuffledCards)
    setFlippedCards([])
    setMoves(0)
    setShowPopup(false)
  }

  useEffect(() => {
    setMounted(true)
    const imagesToPreload = cardData.flatMap(card => [card.image, card.popupImage])
    preloadImages(imagesToPreload)
      .then(() => {
        setIsLoading(false)
        initializeGame()
      })
      .catch(error => {
        console.error("Failed to preload images:", error)
        setIsLoading(false)
        initializeGame()
      })
  }, [])

  if (!mounted) return null
  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  const handleCardClick = (id: number) => {
    if (isWaiting) return // Prevent clicks while waiting for unmatched pair to flip back
    if (flippedCards.length === 2) return
    if (cards.find(card => card.id === id)?.isMatched) return // Prevent clicking on already matched cards
    if (flippedCards.includes(id)) return // Prevent clicking on the same card twice

    const newFlippedCards = [...flippedCards, id]
    setFlippedCards(newFlippedCards)
    setCards(cards.map(card => card.id === id ? { ...card, isFlipped: true } : card))
    setMoves(moves + 1)

    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find(card => card.id === firstId)
      const secondCard = cards.find(card => card.id === secondId)

      if (firstCard && secondCard && firstCard.image === secondCard.image) {
        // Matched pair
        setCards(cards.map(card => 
          card.id === firstId || card.id === secondId 
            ? { ...card, isMatched: true, isFlipped: true } 
            : card
        ))
        setPopupContent({
          title: secondCard.popupTitle,
          description: secondCard.popupDescription,
          image: secondCard.popupImage
        })
        setShowPopup(true)
        setFlippedCards([])
      } else {
        // No match
        setIsWaiting(true)
        setTimeout(() => {
          setCards(cards.map(card => 
            !card.isMatched ? { ...card, isFlipped: false } : card
          ))
          setFlippedCards([])
          setIsWaiting(false)
        }, 1000)
      }
    }
  }

  const isGameOver = cards.every(card => card.isMatched)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 relative overflow-hidden">
      {/* Background image */}
      <div className="fixed bottom-0 right-0 pointer-events-none z-0">
        <Image
          src="/images/big-cat.png"
          alt="Background decoration"
          width={200}
          height={200}
          className="opacity-100"
        />
      </div>

      {/* Theme toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 z-50"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      <h1 className="text-3xl font-bold mb-2 text-primary z-10">Sez un jour spécial aujourd'hui 🎉</h1>
      <p className="text-lg mb-6 text-center max-w-2xl mx-auto z-10">
        ➡️ Ici, c'est le memory game de la Sez pour l'anniversaire de Barbara ! Match les paires de cartes pour découvrir les cadeaux.
      </p>
      
      <div className="w-full max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-4 md:gap-6">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`aspect-square flex items-center justify-center cursor-pointer transition-all duration-300 ${
                card.isFlipped || card.isMatched ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}
              onClick={() => handleCardClick(card.id)}
            >
              {card.isFlipped || card.isMatched ? (
                <Image
                  src={card.image}
                  alt={`Card ${card.id}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                  priority={card.id < 8}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder.svg?height=300&width=300&text=Error";
                  }}
                />
              ) : null}
            </Card>
          ))}
        </div>
      </div>

      <div className="text-lg mt-6 mb-4 z-10">Essais : {moves}</div>
      {isGameOver && <div className="text-2xl font-bold mb-4 text-primary z-10">Allez là, c'est qui la championne ?</div>}
      <Button onClick={initializeGame} className="flex items-center bg-cta text-cta-foreground hover:bg-cta/90 z-10">
        <Shuffle className="mr-2 h-4 w-4" /> On recommence ?
      </Button>

      {showWelcome && <WelcomePopin onClose={() => setShowWelcome(false)} />}

      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="sm:max-w-[625px] p-0 overflow-hidden">
          <div className="p-0">
            <Image 
              src={popupContent.image} 
              alt="Popup" 
              width={625}
              height={400} 
              className="w-full h-auto"
            />
            <div className="p-6">
              <DialogTitle>{popupContent.title}</DialogTitle>
              <DialogDescription>{popupContent.description}</DialogDescription>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

