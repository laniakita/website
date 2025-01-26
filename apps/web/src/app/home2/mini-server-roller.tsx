import { allWorks } from "contentlayer/generated"
import { compareDesc } from "date-fns"
import { MiniWorkPreview } from "../(content)/work/mini-work-preview"

export function MiniWorkRoller() {
  return allWorks.sort((a, b) =>
    compareDesc(new Date(a.endDate ?? a.startDate), new Date(b.endDate ?? b.startDate)),
  ).map((proj) => (
    <MiniWorkPreview
      key={crypto.randomUUID()}
      {...proj}
    />
  ))
}
