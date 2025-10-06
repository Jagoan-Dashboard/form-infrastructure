// import * as React from "react";
// import { Icon } from "@iconify/react";
import { cn } from "~/lib/utils";
// import { speechToText } from "~/lib/speech-to-text";

// interface TextareaWithMicProps extends React.ComponentProps<"textarea"> {
//   enableVoice?: boolean;
// }

// Speech-to-text functionality temporarily disabled
// This component now renders a regular textarea without voice recording
function TextareaWithMic({
  className,
  // enableVoice = true,
  ...props
}: React.ComponentProps<"textarea">) {
  // const [isListening, setIsListening] = React.useState(false);
  // const [isMicAvailable, setIsMicAvailable] = React.useState(true);
  // const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // React.useEffect(() => {
  //   if (enableVoice) {
  //     speechToText.checkMicrophoneAccess().then(setIsMicAvailable);

  //     // Subscribe to state changes
  //     const unsubscribe = speechToText.onStateChange((listening, activeInput) => {
  //       // Only set listening state if this textarea is the active one
  //       setIsListening(listening && activeInput === textareaRef.current);
  //     });
  //     return () => {
  //       unsubscribe();
  //     };
  //   }
  // }, [enableVoice]);

  // const handleMicClick = () => {
  //   if (!textareaRef.current || !isMicAvailable) return;

  //   if (isListening) {
  //     speechToText.stopListening();
  //   } else {
  //     speechToText.startListening(textareaRef.current as any);
  //   }
  // };

  // // Sync ref value with controlled value
  // React.useEffect(() => {
  //   if (textareaRef.current && props.value !== undefined) {
  //     textareaRef.current.value = String(props.value);
  //   }
  // }, [props.value]);

  // Regular textarea without voice functionality
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-h-20 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );

  // if (!enableVoice) {
  //   return (
  //     <textarea
  //       data-slot="textarea"
  //       className={cn(
  //         "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-h-20 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  //         "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  //         "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  //         className
  //       )}
  //       {...props}
  //     />
  //   );
  // }

  // return (
  //   <div className="relative w-full">
  //     <textarea
  //       ref={textareaRef}
  //       data-slot="textarea"
  //       className={cn(
  //         "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-h-20 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  //         "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  //         "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  //         "pr-10",
  //         className
  //       )}
  //       {...props}
  //     />
  //     <button
  //       type="button"
  //       onClick={handleMicClick}
  //       className={cn(
  //         "absolute right-3 top-3 flex items-center justify-center transition-colors",
  //         "focus:outline-none",
  //         isListening
  //           ? "text-blue-600 animate-pulse"
  //           : "text-gray-400 hover:text-blue-600",
  //         !isMicAvailable && "text-muted-foreground/50 cursor-not-allowed hover:text-muted-foreground/50"
  //       )}
  //       disabled={!isMicAvailable}
  //       title={
  //         isMicAvailable
  //           ? isListening
  //             ? "Klik untuk berhenti merekam"
  //             : "Klik untuk mulai perekaman suara"
  //           : "Mikrofon tidak tersedia"
  //       }
  //     >
  //       <Icon
  //         icon={isListening ? "mdi:microphone" : "mdi:microphone-outline"}
  //         className="w-5 h-5"
  //       />
  //     </button>
  //   </div>
  // );
}

export { TextareaWithMic };
