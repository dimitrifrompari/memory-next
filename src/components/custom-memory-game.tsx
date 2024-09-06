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

  useEffect(() => {
    setMounted(true)
    initializeGame()
  }, [])

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
  }

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return
    if (cards[id].isMatched) return
    if (flippedCards.includes(id)) return // Prevent clicking the same card twice

    const newCards = [...cards]
    newCards[id].isFlipped = true
    setCards(newCards)

    if (flippedCards.length === 0) {
      setFlippedCards([id])
    } else if (flippedCards.length === 1) {
      setMoves(moves + 1)
      const firstCardId = flippedCards[0]
      if (firstCardId !== id && cards[firstCardId].image === newCards[id].image) {
        newCards[firstCardId].isMatched = true
        newCards[id].isMatched = true
        setCards(newCards)
        setFlippedCards([])
        setPopupContent({
          title: newCards[id].popupTitle,
          description: newCards[id].popupDescription,
          image: newCards[id].popupImage,
        })
        setShowPopup(true)
      } else {
        setFlippedCards([firstCardId, id])
        setTimeout(() => {
          newCards[firstCardId].isFlipped = false
          newCards[id].isFlipped = false
          setCards(newCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const isGameOver = cards.every((card) => card.isMatched)

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 relative overflow-hidden">
      
      <Button
        className="absolute top-4 right-4"
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        <span className="sr-only">Toggle theme</span>
      </Button>

      <h1 className="text-3xl font-bold mb-2 text-primary">Barbara&apos;s special 34th birthday game</h1>
      <p className="text-lg mb-6 text-center max-w-2xl mx-auto">
        Welcome to Barbara&apos;s birthday memory game! Match pairs of cards to reveal special moments and memories. Can you find them all?
      </p>
      
      <div className="w-full max-w-7xl mx-auto" style={{ zIndex: 1 }}>
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

      <div className="text-lg mt-6 mb-4">Essais : {moves}</div>
      {isGameOver && <div className="text-2xl font-bold mb-4 text-primary">Allez là, c&apos;est qui la championne ?</div>}
      <Button onClick={initializeGame} className="flex items-center bg-cta text-cta-foreground hover:bg-cta/90">
        <Shuffle className="mr-2 h-4 w-4" /> On recommence ?
      </Button>

      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="p-1 sm:max-w-[800px]"> {/* Increased max-width */}
          <DialogHeader className="space-y-4">
            <Image 
              src={popupContent.image} 
              alt="Popup" 
              width={800}
              height={800} 
              className="w-full h-auto rounded-lg mb-2"
            />
            <div className="px-4 pb-4"> {/* Added 16px padding left and right, 16px padding bottom */}
              <DialogTitle>{popupContent.title}</DialogTitle>
              <DialogDescription>{popupContent.description}</DialogDescription>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Background image */}
      <div className="absolute bottom-0 right-0 pointer-events-none">
        <Image
          src="/images/big-cat.png"  // Replace with your image path
          alt="Background decoration"
          width={200}  // Adjust as needed
          height={200} // Adjust as needed
          className="opacity-100"  // Adjust opacity as needed
        />
      </div>
    </div>
  )
}