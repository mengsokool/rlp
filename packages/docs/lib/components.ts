import { Card, CardGrid } from '@/components/markdown/card'
import { LatestRelease } from '@/components/markdown/latest-release'
import { Route } from '@/components/markdown/link'
import { Mermaid } from '@/components/markdown/mermaid'
import { Note } from '@/components/markdown/note'
import { Step, StepItem } from '@/components/markdown/step'
import { Pre } from '@/components/ui/pre'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const components = {
  a: Route,
  Card,
  CardGrid,
  LatestRelease,
  Mermaid,
  Note,
  pre: Pre,
  Step,
  StepItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
}
