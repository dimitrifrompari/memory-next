import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface WelcomePopinProps {
  onClose: () => void
}

export function WelcomePopin({ onClose }: WelcomePopinProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] w-[95vw] max-h-[90vh] p-0 overflow-y-auto bg-background/80 backdrop-blur-sm">
        <div className="absolute inset-0 bg-white -z-10" aria-hidden="true" />
        <div className="bg-[#101720] h-[100px] sm:h-[200px] flex items-center justify-center">
          <span className="text-[30px] sm:text-[40px]">🎉</span>
        </div>
        <div className="p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Joyeux 34 ans 🧡</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Cette année, après les chasses au trésors, les prototypes Figma, les charades ou autres scans de QR codes, j'ai demandé a la SEZ comment te surprendre. Elle a dit "Meow", j'ai trouvé que c'était une idée de génie, je l'ai remerciée, elle a dit "raboule la paté".
              <br /><br />
              Après, j'ai passé quelques soirées à coder, j'étais pas tout seul mais c'était pas facile. J'y ai mis du temps, de l'amour, de l'envie et j'espère, du fun!
              <br /><br />
              Un giga, mega, ultra bon anniversaire d'amour, avec des cadeaux dont un que tu rendras mais je te laisse choisir lequel.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 sm:mt-6 flex justify-center">
            <Button onClick={onClose}>Je t'aime</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}