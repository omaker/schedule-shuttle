import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onUpdate: () => void;
}

export const EditShippingModal = ({ isOpen, onClose, item, onUpdate }: EditShippingModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    product: "",
    plan_qty: "",
    company: "",
    terminal: "",
    country: "",
    loading_status: ""
  });

  useEffect(() => {
    if (item) {
      console.log("Setting form data with item:", item);
      setFormData({
        product: item.product || "",
        plan_qty: item.plan_qty?.toString() || "",
        company: item.company || "",
        terminal: item.terminal || "",
        country: item.country || "",
        loading_status: item.loading_status || ""
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!item?.excel_id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid shipping record ID",
        });
        return;
      }

      console.log("Updating record with data:", {
        excel_id: item.excel_id,
        formData
      });

      const { error } = await supabase
        .from('shipping_schedules')
        .update({
          product: formData.product,
          plan_qty: Number(formData.plan_qty),
          company: formData.company,
          terminal: formData.terminal,
          country: formData.country,
          loading_status: formData.loading_status
        })
        .eq('excel_id', item.excel_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shipping record updated successfully",
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating record:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update shipping record",
      });
    }
  };

  if (!item) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Shipping Record #{item.excel_id}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Input
                id="product"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan_qty">Quantity (tons)</Label>
              <Input
                id="plan_qty"
                type="number"
                value={formData.plan_qty}
                onChange={(e) => setFormData({ ...formData, plan_qty: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="terminal">Terminal</Label>
              <Input
                id="terminal"
                value={formData.terminal}
                onChange={(e) => setFormData({ ...formData, terminal: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loading_status">Status</Label>
              <Input
                id="loading_status"
                value={formData.loading_status}
                onChange={(e) => setFormData({ ...formData, loading_status: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};