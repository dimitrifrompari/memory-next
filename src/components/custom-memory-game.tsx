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

    const newCards = [...cards]
    newCards[id].isFlipped = true
    setCards(newCards)

    setFlippedCards([...flippedCards, id])

    if (flippedCards.length === 1) {
      setMoves(moves + 1)
      if (cards[flippedCards[0]].image === newCards[id].image) {
        newCards[flippedCards[0]].isMatched = true
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
        setTimeout(() => {
          newCards[flippedCards[0]].isFlipped = false
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 relative">
      <Button
        className="absolute top-4 right-4"
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        <span className="sr-only">Toggle theme</span>
      </Button>

      <h1 className="text-3xl font-bold mb-2 text-primary">Barbara's special 34th birthday game</h1>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {cards.map((card) => (
          <Card
            key={card.id}
            className={`w-24 h-24 flex items-center justify-center cursor-pointer transition-all duration-300 ${
              card.isFlipped || card.isMatched ? "bg-primary text-primary-foreground" : "bg-secondary"
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            {card.isFlipped || card.isMatched ? (
              <img
                src={card.image}
                alt={`Card ${card.id}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/placeholder.svg?height=128&width=128&text=Error";
                }}
              />
            ) : null}
          </Card>
        ))}
      </div>
      <div className="text-lg mb-4">Moves: {moves}</div>
      {isGameOver && <div className="text-2xl font-bold mb-4 text-primary">Congratulations! You won!</div>}
      <Button onClick={initializeGame} className="flex items-center bg-cta text-cta-foreground hover:bg-cta/90">
        <Shuffle className="mr-2 h-4 w-4" /> New Game
      </Button>

      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{popupContent.title}</DialogTitle>
            <DialogDescription>{popupContent.description}</DialogDescription>
          </DialogHeader>
          <img src={popupContent.image} alt="Popup" className="w-full h-auto" />
        </DialogContent>
      </Dialog>
    </div>
  )
}