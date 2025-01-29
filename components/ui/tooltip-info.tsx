import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function TooltipInfo({ label, tooltip }: { label: string; tooltip: string }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="cursor-default">{label}</TooltipTrigger>
                <TooltipContent>
                    <p className="text-xs text-muted-foreground max-w-[250px]">{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
