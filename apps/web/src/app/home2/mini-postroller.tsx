'use client'

import { allPosts } from "contentlayer/generated"
import { HomePostPreview } from "../(content)/blog/post-components"
import { compareDesc } from "date-fns"

export default function MiniPostRoller() {
  return allPosts.sort((a, b) => compareDesc(new Date(a.updated ?? a.date), new Date(b.updated ?? b.date))).slice(0, 10).map((post, idx) => (
    <HomePostPreview key={crypto.randomUUID()} {...{ post: post }} />
  ))
}


