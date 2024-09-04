"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Shuffle } from "lucide-react"

// Custom images and their corresponding pop-up content
const cardData = [
  { 
    image: "/images/image 01.png",
    popupTitle: "You found a pair of 1s!",
    popupDescription: "The number one is the first counting number."
  },
  { 
    image: "/images/image 03.png",
    popupTitle: "You matched the 2s!",
    popupDescription: "Two is the only even prime number."
  },
  { 
    image: "/images/image 04.png",
    popupTitle: "Three's a crowd!",
    popupDescription: "Three is considered a lucky number in many cultures."
  },
  { 
    image: "/placeholder.svg?height=80&width=80&text=4",
    popupTitle: "Four-tastic!",
    popupDescription: "Four is the smallest composite number."
  },
  { 
    image: "/placeholder.svg?height=80&width=80&text=5",
    popupTitle: "High five!",
    popupDescription: "Five is the number of fingers on a human hand."
  },
  { 
    image: "/placeholder.svg?height=80&width=80&text=6",
    popupTitle: "Six appeal!",
    popupDescription: "Six is the smallest perfect number."
  },
  { 
    image: "/placeholder.svg?height=80&width=80&text=7",
    popupTitle: "Lucky seven!",
    popupDescription: "Seven is considered a lucky number in many Western cultures."
  },
  { 
    image: "/placeholder.svg?height=80&width=80&text=8",
    popupTitle: "Great eight!",
    popupDescription: "Eight is the largest cube in the Fibonacci sequence."
  },
]

interface CardType {
  id: number
  image: string
  popupTitle: string
  popupDescription: string
  isFlipped: boolean
  isMatched: boolean
}

export function CustomMemoryGame() {
  const [cards, setCards] = useState<CardType[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [popupContent, setPopupContent] = useState({ title: "", description: "" })

  useEffect(() => {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-2 text-primary">Custom Memory Game</h1>
      <p className="text-lg mb-4 text-center text-secondary-foreground">Match pairs of numbers to win. Click on cards to reveal them!</p>
      <div className="grid grid-cols-4 gap-6 mb-4">
        {cards.map((card) => (
          <Card
            key={card.id}
            className={`w-32 h-32 flex items-center justify-center cursor-pointer transition-all duration-300 ${
              card.isFlipped || card.isMatched ? "bg-primary" : "bg-secondary"
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            {card.isFlipped || card.isMatched ? (
              <img 
                src={card.image} 
                alt="Card" 
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
      <Button onClick={initializeGame} className="flex items-center">
        <Shuffle className="mr-2 h-4 w-4" /> New Game
      </Button>

      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{popupContent.title}</DialogTitle>
            <DialogDescription>{popupContent.description}</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowPopup(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}