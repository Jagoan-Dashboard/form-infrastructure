import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { useNavigate } from "react-router";

// Success Alert Component
export function SuccessAlert({ 
  open, 
  onClose,
  title = "Berhasil!",
  description = "Terima kasih. Jawaban Anda sudah terkirim!"
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}) {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      timer = setTimeout(() => {
        onClose();
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [open, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl p-8">
        <DialogHeader className="items-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <Icon icon="mdi:check" className="w-12 h-12 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-green-600 text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 rounded-xl text-lg mt-4"
        >
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
}