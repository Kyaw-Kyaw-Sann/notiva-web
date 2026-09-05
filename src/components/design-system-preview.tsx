"use client";

import { Moon, MoreHorizontal, Palette, Plus, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingState } from "@/components/common/loading-state";
import { ContentContainer } from "@/components/layout/content-container";
import { PageContainer } from "@/components/layout/page-container";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const noteColors = ["DEFAULT", "YELLOW", "GREEN", "BLUE", "PINK", "PURPLE", "GRAY"] as const;
const tokenColors = ["background", "surface", "surface-muted", "primary", "secondary", "success", "warning", "destructive"] as const;

export function DesignSystemPreview() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <main className="min-h-screen bg-background">
      <PageContainer>
        <ContentContainer width="wide-editor" className="space-y-12">
          <header className="flex flex-col gap-5 border-b pb-8 sm:flex-row sm:items-start sm:justify-between">
            <div><p className="text-sm font-medium text-primary">Notiva</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Design system</h1><p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">Reusable foundations for calm, accessible productivity interfaces.</p></div>
            <Button variant="outline" onClick={() => setTheme(isDark ? "light" : "dark")}><Sun className="dark:hidden" /><Moon className="hidden dark:block" />{isDark ? "Light theme" : "Dark theme"}</Button>
          </header>

          <Section title="Typography" description="Practical type scale for writing and workspaces.">
            <div className="space-y-3 rounded-xl border bg-surface p-5"><h1 className="text-3xl font-semibold tracking-tight">Page title</h1><h2 className="text-xl font-semibold tracking-tight">Section title</h2><h3 className="text-lg font-semibold">Card title</h3><p>Body text is optimized for comfortable reading in a notes product.</p><p className="text-sm">Small body text</p><p className="text-sm font-medium">Label</p><p className="text-xs text-muted-foreground">Caption and muted text</p></div>
          </Section>

          <Section title="Semantic colors" description="Theme-aware semantic tokens."><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{tokenColors.map((color) => <div key={color} className="overflow-hidden rounded-lg border"><div className="h-16" style={{ backgroundColor: `var(--${color})` }} /><p className="bg-surface px-3 py-2 text-xs font-medium">{color}</p></div>)}</div></Section>

          <Section title="Note background tokens" description="Visual mappings for backend note background enums only."><div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">{noteColors.map((color) => <div key={color} className="rounded-lg border p-3" style={{ backgroundColor: `var(--note-${color.toLowerCase()})` }}><p className="text-xs font-medium">{color}</p></div>)}</div></Section>

          <Section title="Buttons" description="Consistent states, sizes, and focus treatment."><div className="flex flex-wrap gap-3"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="destructive">Destructive</Button><Button disabled>Disabled</Button><Button size="sm">Small</Button><Button size="lg">Large</Button><Button size="icon" aria-label="Add item"><Plus /></Button></div></Section>

          <Section title="Form controls"><Card><CardHeader><CardTitle>Form surface</CardTitle><CardDescription>Controls share border, radius, hover, focus, error, and disabled behavior.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="sample-input">Input</Label><Input id="sample-input" placeholder="Write something…" /></div><div className="space-y-2"><Label htmlFor="invalid-input">Error input</Label><Input id="invalid-input" aria-invalid="true" defaultValue="Invalid value" /></div><div className="space-y-2 sm:col-span-2"><Label htmlFor="sample-textarea">Textarea</Label><Textarea id="sample-textarea" placeholder="Longer note content…" /></div></CardContent></Card></Section>

          <Section title="Badges, cards, and menus"><div className="grid gap-5 lg:grid-cols-2"><Card><CardHeader><CardTitle>Surface card</CardTitle><CardDescription>Subtle elevation and calm borders.</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-2"><Badge>Default</Badge><Badge variant="secondary">Secondary</Badge><Badge variant="outline">Outline</Badge><Badge variant="success">Success</Badge><Badge variant="warning">Warning</Badge><Badge variant="destructive">Destructive</Badge></CardContent></Card><Card><CardHeader><CardTitle>Interactive primitives</CardTitle><CardDescription>Radix primitives preserve keyboard behavior.</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-3"><Dialog><DialogTrigger asChild><Button variant="outline">Open dialog</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Dialog example</DialogTitle><DialogDescription>Press Escape or use the close button to dismiss this dialog.</DialogDescription></DialogHeader><DialogFooter><Button>Confirm</Button></DialogFooter></DialogContent></Dialog><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline"><MoreHorizontal />Menu</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem>Preview action</DropdownMenuItem><DropdownMenuItem>Another action</DropdownMenuItem></DropdownMenuContent></DropdownMenu></CardContent></Card></div></Section>

          <Section title="Reusable states"><div className="grid gap-5 lg:grid-cols-3"><EmptyState icon={Palette} title="Nothing here yet" description="Use this neutral state when a collection is empty." action={<Button size="sm">Add item</Button>} /><ErrorState title="Could not load content" description="Please try again when you are ready." action={<Button size="sm" variant="outline">Retry</Button>} /><div className="rounded-xl border bg-surface p-5"><p className="mb-4 text-sm font-medium">Loading content</p><LoadingState /></div></div></Section>

          <Section title="Responsive containers" description="Resize the viewport to verify mobile, tablet, and desktop spacing."><Separator /><p className="text-sm text-muted-foreground">PageContainer provides responsive padding; ContentContainer supplies predictable reading widths.</p></Section>
        </ContentContainer>
      </PageContainer>
    </main>
  );
}
