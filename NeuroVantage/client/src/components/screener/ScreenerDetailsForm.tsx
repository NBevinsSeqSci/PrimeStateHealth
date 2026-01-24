import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { CTA_LABELS } from "@/lib/copy";

export type ScreenerDetailsFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
};

type Props = {
  form: UseFormReturn<ScreenerDetailsFormValues>;
  onSubmit: () => void;
};

export function ScreenerDetailsForm({ form, onSubmit }: Props) {
  return (
    <Card className="p-8 md:p-12 shadow-xl border-0 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-primary">
          Your details
        </h2>
        <p className="text-muted-foreground">
          We use this to personalize your summary.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Age <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" inputMode="numeric" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email Address <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="email" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-12 text-lg mt-4">
            {CTA_LABELS.continue} <span aria-hidden className="ml-2">→</span>
          </Button>
        </form>
      </Form>
    </Card>
  );
}
