import { buttonVariants } from "@/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/tooltip";
import { cn } from "@/utils";

interface LinksLimitProps {
  userLinks: number;
  maxLinks: number;
}

const LinksLimit = ({ userLinks, maxLinks }: LinksLimitProps) => {
  const isInfinite = !Number.isFinite(maxLinks);
  const max = !isInfinite && userLinks >= maxLinks;
  const mid = !isInfinite && userLinks >= maxLinks / 2;
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={buttonVariants({
              variant: "outline",
              className: "cursor-default font-mono shadow-none",
            })}
          >
            <div className={cn("flex items-center space-x-2")}> 
              <span>
                {userLinks}/{isInfinite ? "∞" : maxLinks}
              </span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isInfinite ? (
            <p>You have created {userLinks} items. Unlimited plan.</p>
          ) : max ? (
            <p>You have reached the maximum limit of {maxLinks} items.</p>
          ) : (
            <p>
              You have created {userLinks} out of {maxLinks} items.
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LinksLimit;
