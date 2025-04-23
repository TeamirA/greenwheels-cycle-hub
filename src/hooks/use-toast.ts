
// Import from the shadcn toast components
import { toast } from "@/components/ui/toast";
import { useToast as useToastOriginal } from "@/components/ui/toast";

// Re-export them
export const useToast = useToastOriginal;
export { toast };
