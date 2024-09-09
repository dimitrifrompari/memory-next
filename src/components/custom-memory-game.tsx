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
const preloadImages = (images: string[]) => {
  images.forEach((src) => {
    const img = new window.Image();
    img.src = src;
  });
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
    initializeGame()
  }, [])

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return
    if (cards.find(card => card.id === id)?.isMatched) return // Prevent clicking on already matched cards

    setCards(cards.map(card => card.id === id ? { ...card, isFlipped: true } : card))
    setFlippedCards([...flippedCards, id])
    setMoves(moves + 1)

    if (flippedCards.length === 1) {
      const firstCard = cards.find(card => card.id === flippedCards[0])
      const secondCard = cards.find(card => card.id === id)
      if (firstCard && secondCard && firstCard.image === secondCard.image) {
        // Matched pair
        setCards(cards.map(card => 
          card.id === firstCard.id || card.id === secondCard.id 
            ? { ...card, isMatched: true, isFlipped: true } 
            : card
        ))
        setPopupContent({
          title: secondCard.popupTitle,
          description: secondCard.popupDescription,
          image: secondCard.popupImage
        })
        setShowPopup(true)
        setFlippedCards([]) // Reset flipped cards after a match
      } else {
        // No match
        setTimeout(() => {
          setCards(cards.map(card => 
            !card.isMatched ? { ...card, isFlipped: false } : card
          ))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const isGameOver = cards.every(card => card.isMatched)

  if (!mounted) return null

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

