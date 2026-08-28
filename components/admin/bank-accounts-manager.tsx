"use client";

import * as React from "react";
import { BankAccount } from "@/lib/types/bank-account";
import { createBankAccountAction, updateBankAccountAction, deleteBankAccountAction } from "@/lib/actions/admin-bank-accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/common/submit-button";
import { Building2, Plus, Edit2, Trash2, CheckCircle2, Star, CreditCard, AlertCircle } from "lucide-react";

export function BankAccountsManager({ accounts }: { accounts: BankAccount[] }) {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [showAddForm, setShowAddForm] = React.useState(false);

  const activeAccount = accounts.find((a) => a.id === editingId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">UK Bank Transfer (BACS) Accounts</h2>
        </div>
        {!showAddForm && (
          <Button
            size="sm"
            onClick={() => {
              setEditingId(null);
              setShowAddForm(true);
            }}
            className="font-bold shadow-xs"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Add New Bank Account
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Configure the official UK bank accounts shown to customers during checkout and on transfer order confirmation receipts.
      </p>

      {/* Add New Bank Account Form */}
      {showAddForm && (
        <form
          action={createBankAccountAction}
          className="p-5 rounded-2xl bg-card border-2 border-primary/30 space-y-4 shadow-sm animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-sm flex items-center space-x-2">
              <Plus className="h-4 w-4 text-primary" />
              <span>Add Official UK Bank Account</span>
            </h3>
            <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Bank Name *</label>
              <Input name="bankName" placeholder="e.g. Barclays Bank UK" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Account Name *</label>
              <Input name="accountName" placeholder="e.g. Enat Market Ltd" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Sort Code *</label>
              <Input name="sortCode" placeholder="e.g. 20-00-00" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Account Number *</label>
              <Input name="accountNumber" placeholder="e.g. 87654321" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">IBAN (Optional)</label>
              <Input name="iban" placeholder="e.g. GB29 BARC 2000 0087 6543 21" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">SWIFT / BIC (Optional)</label>
              <Input name="swiftBic" placeholder="e.g. BARCGB22" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Customer Payment Instructions</label>
            <textarea
              name="instructions"
              rows={2}
              placeholder="e.g. Please use your Order Number (ORD-XXXX) as payment reference."
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs"
              defaultValue="Please use your Order Number (e.g. ORD-XXXX) as payment reference."
            />
          </div>

          <div className="flex items-center space-x-6 pt-1">
            <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
              <input type="checkbox" name="isActive" value="true" defaultChecked className="rounded border-input text-primary" />
              <span>Active & Displayed on Public Checkout</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
              <input type="checkbox" name="isPrimary" value="true" defaultChecked className="rounded border-input text-primary" />
              <span>Set as Primary Account</span>
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <SubmitButton size="sm" loadingText="Saving Bank Account...">
              Save Bank Account
            </SubmitButton>
          </div>
        </form>
      )}

      {/* Grid of Existing Bank Accounts */}
      <div className="grid grid-cols-1 gap-4">
        {accounts.map((acc) => {
          const isEditing = editingId === acc.id;

          if (isEditing) {
            return (
              <form
                key={acc.id}
                action={updateBankAccountAction.bind(null, acc.id)}
                className="p-5 rounded-2xl bg-card border-2 border-primary/30 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-bold text-sm flex items-center space-x-2">
                    <Edit2 className="h-4 w-4 text-primary" />
                    <span>Edit {acc.bank_name}</span>
                  </h3>
                  <Button variant="ghost" size="sm" type="button" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Bank Name *</label>
                    <Input name="bankName" defaultValue={acc.bank_name} required />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Account Name *</label>
                    <Input name="accountName" defaultValue={acc.account_name} required />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Sort Code *</label>
                    <Input name="sortCode" defaultValue={acc.sort_code} required />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Account Number *</label>
                    <Input name="accountNumber" defaultValue={acc.account_number} required />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">IBAN</label>
                    <Input name="iban" defaultValue={acc.iban || ""} />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">SWIFT / BIC</label>
                    <Input name="swiftBic" defaultValue={acc.swift_bic || ""} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Instructions</label>
                  <textarea
                    name="instructions"
                    rows={2}
                    defaultValue={acc.instructions || ""}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs"
                  />
                </div>

                <div className="flex items-center space-x-6 pt-1">
                  <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                    <input type="checkbox" name="isActive" value="true" defaultChecked={acc.is_active} className="rounded border-input text-primary" />
                    <span>Active & Displayed on Public Checkout</span>
                  </label>

                  <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                    <input type="checkbox" name="isPrimary" value="true" defaultChecked={acc.is_primary} className="rounded border-input text-primary" />
                    <span>Set as Primary Account</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                  <SubmitButton size="sm" loadingText="Updating Bank Account...">
                    Update Changes
                  </SubmitButton>
                </div>
              </form>
            );
          }

          return (
            <div
              key={acc.id}
              className={`p-5 rounded-2xl border bg-card shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                acc.is_primary ? "border-primary/50 bg-primary/5" : "border-border"
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-base text-foreground flex items-center space-x-2">
                    <Building2 className="h-4.5 w-4.5 text-primary" />
                    <span>{acc.bank_name}</span>
                  </h3>
                  {acc.is_primary && (
                    <Badge variant="secondary" className="bg-amber-500/15 text-amber-500 border-amber-500/30 text-[10px] font-bold">
                      <Star className="h-3 w-3 mr-1 fill-amber-500" /> Primary Account
                    </Badge>
                  )}
                  {acc.is_active ? (
                    <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-[10px]">
                      Disabled
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-background/80 border border-border/60 p-3.5 rounded-xl text-xs font-medium">
                  <div>
                    <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Account Name</span>
                    <span className="font-bold text-foreground">{acc.account_name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Sort Code</span>
                    <span className="font-bold text-foreground">{acc.sort_code}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Account Number</span>
                    <span className="font-bold text-foreground">{acc.account_number}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-muted-foreground uppercase font-semibold">IBAN / SWIFT</span>
                    <span className="font-bold text-foreground">{acc.iban || acc.swift_bic || "N/A"}</span>
                  </div>
                </div>

                {acc.instructions && (
                  <p className="text-[11px] text-muted-foreground italic">
                    Note: {acc.instructions}
                  </p>
                )}
              </div>

              {/* Edit & Delete Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(acc.id);
                  }}
                  className="font-bold text-xs"
                >
                  <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>

                <form action={deleteBankAccountAction.bind(null, acc.id)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs font-bold"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
