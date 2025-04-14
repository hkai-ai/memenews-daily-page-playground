import { Asterisk } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../common/ui/form"
import { Textarea } from "../../common/ui/textarea"

interface CommentFieldProps {
  form: UseFormReturn<any>
}

export function CommentField({ form }: CommentFieldProps) {
  return (
    <FormField
      control={form.control}
      name="comment"
      render={({ field }) => (
        <FormItem className="flex flex-col gap-2">
          <FormLabel className="flex items-center gap-1 pl-3">
            <Asterisk className="inline size-3 stroke-red-500" />
            吐槽/锐评
          </FormLabel>
          <FormControl style={{ marginTop: 0 }}>
            <div className="relative p-3 mt-0 ">
              <Textarea
                placeholder="为什么你要推荐这个账号以及你对这个账号的评价"
                className="rounded-md text-xs"
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
