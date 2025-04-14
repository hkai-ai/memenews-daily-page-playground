"use client"

import { useState } from "react"
import { Search, User, GitFork } from "lucide-react"

import { ComingSoon } from "../../common/coming-soon/index"
import { SidebarMenuButton } from "../../common/ui/sidebar"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/lib/components/common/ui/command"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/lib/components/common/ui/dialog"
import { cn } from "@/lib/utils"

export function SearchDialog({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton
          variant="outline"
          onClick={() => setOpen(true)}
          className={cn("h-9 w-full gap-2", className)}
        >
          <Search className="size-3.5" />
          <span className="pr-4 text-xs text-muted-foreground">
            搜索日报、meme、信息源...
          </span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="p-0">
        <ComingSoon>
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Type to search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="xxxxxxxxxx">
                <CommandItem>
                  <Search className="mr-2 h-4 w-4" />
                  <span>xxxxxxxxxx</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    xxxxxxxxxx
                  </span>
                </CommandItem>
                <CommandItem>
                  <Search className="mr-2 h-4 w-4" />
                  <span>xxxxxxxxxx</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    xxxxxxxxxx
                  </span>
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="xxxxxxxxxx">
                <CommandItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>xxxxxxxxxx</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    xxxxxxxxxx
                  </span>
                </CommandItem>
                <CommandItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>xxxxxxxxxx</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    xxxxxxxxxx
                  </span>
                </CommandItem>
                <CommandItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>xxxxxxxxxx</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    xxxxxxxxxx
                  </span>
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="xxxxxxxxxx">
                <CommandItem>
                  <GitFork className="mr-2 h-4 w-4" />
                  <span>xxxxxxxxxx</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    xxxxxxxxxx
                  </span>
                </CommandItem>
                <CommandItem>
                  <GitFork className="mr-2 h-4 w-4" />
                  <span>xxxxxxxxxx</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    xxxxxxxxxx
                  </span>
                </CommandItem>
                <CommandItem>
                  <GitFork className="mr-2 h-4 w-4" />
                  <span>xxxxxxxxxx</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    xxxxxxxxxx
                  </span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </ComingSoon>
      </DialogContent>
    </Dialog>
  )
}
