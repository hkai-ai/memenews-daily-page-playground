import { Eye } from "lucide-react"
import { useState } from "react"

import { TemplateOption } from "../subscriptions/SubscribeCart"

import { Card } from "@/lib/components/common/ui/card"
import { Label } from "@/lib/components/common/ui/label"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/lib/components/common/ui/dialog"

interface TemplateSelectProps {
  value: string
  onChange: (value: string) => void
  templates: TemplateOption[]
}

export function TemplateSelect({
  value,
  onChange,
  templates,
}: TemplateSelectProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateOption | null>(null)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={cn(
            "relative cursor-pointer p-4 transition-all hover:shadow",
            "border-2",
            value === template.id
              ? "border-green-500 shadow-sm"
              : "border-gray-200",
            template.disabled &&
              "pointer-events-none cursor-not-allowed opacity-50",
          )}
          onClick={() => onChange(template.id)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-4 w-4 rounded-full border-2",
                  value === template.id
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300",
                )}
              />
              <div className="space-y-1">
                <Label className="font-medium">{template.name}</Label>
              </div>
            </div>
            {template.previewImg && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedTemplate(template)
                  setPreviewOpen(true)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <Eye size={20} />
              </button>
            )}
          </div>
        </Card>
      ))}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="h-[80vh] overflow-y-auto sm:max-w-lg">
          {selectedTemplate?.previewImg && (
            <img
              src={selectedTemplate.previewImg}
              alt={selectedTemplate.name}
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
