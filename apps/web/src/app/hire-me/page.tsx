import GlobalMDXComponent from "@/components/mdx/global-mdx-components";
import { resMdxMinimal } from "@/lib/mdx-utils";
import { Page } from "contentlayer/generated";

const str = `
---
title: Developed by Lani Akita
description: I offer a multitude of services, from my years of experience spent honing my craft as a Full Stack Web Developer.
date: 2025-02-09T05:29:20Z
---

# Made in Hawai'i with Love,<br /> by Lani Akita

**Thank you for your interest!**

The table below is a _non-exhaustive_ list of Software Development services I offer. 

|   Service   |    Description    |
|-------------|-------------------|
|Developer Consulting| I offer my analytical-skills as a trained Biologist, and my years spent behind the command line and text-editor, to help your business grow.|
|Front-end Development| My Front-end skillset can be used to build elegant, accesible, responsive, user interfaces, immersive digital experiences powered by WebGL (and now WebGPU) via Three.js, brochure sites, and more.|
|Back-end Development| My back-end skills can be used to create APIs, internal web applications, content management systems, and anything else that CRUD's the rows and tables of a database (or several).|
|Full-Stack Development| For projects that require me to work on both ends of the stack (like creating a Next.js/SvelteKit based application), my entire breadth of knowledge is available as a single service.| 
|AI-generated Software Application Rescue (AGAR)| LLMs and AI assistants are tools, but when wielded improperly, can result in deeply flawed, highly fragile, software applications. I offer my sympathetic ear, along with my software engineering skillset, to help make things right when AI-generated applications go awry.|

When you're ready, just fill out the form below, and I'll get in touch with you as soon as I can! _Mahalo nui loa_.
`.trim();

export default async function ForHirePage() {


  const res = await resMdxMinimal(str)

  const obj = {
    body: {
      code: res.code
    }
  }

  const placeHolderLaunchYear = () => {
    const currDate = new Date();
    currDate.setFullYear(currDate.getFullYear() + 2);
    return currDate.getFullYear().toString();
  }

  return (
    <main className="py-common-info-page">
      <div className="flex size-full flex-col items-center justify-center">
        <div className='flex min-h-full items-center justify-center padding-post'>
          <div className='prose-protocol-omega max-w-3xl px-0'>
            <GlobalMDXComponent {...obj as unknown as Page} />
          </div>
        </div>
        <form className="flex flex-col gap-y-4 w-full max-w-3xl bg-ctp-base rounded p-6 font-mono border border-ctp-mauve rounded">
          <div className="flex flex-row gap-x-2 items-center">
            <label htmlFor="proj-type-select">I want to hire you for a:</label>
            <select name="project-types" id="proj-type-select" className="bg-ctp-crust rounded font-semibold w-fit px-2 py-1 text-center">
              <option value="">--select a project type--</option>
              <option value="existing">existing project</option>
              <option value="greenfield">greenfield (new) project</option>
            </select>
          </div>

          {/* if existing project */}
          <div className="space-y-2">

            <p>---For existing projects---</p>
            <div className="flex flex-row gap-x-2 items-center">
              <label htmlFor="proj-age">My project launched in:</label>
              <input placeholder="2020" id="proj-age" className='bg-ctp-crust rounded font-semibold px-2 py-1 w-[6ch] text-center' />
            </div>

            <div className="flex flex-row gap-x-2 items-center">
              <label htmlFor="proj-user-count">It serves around:</label>
              <input placeholder="10 Million" id="proj-user-count" className='bg-ctp-crust rounded font-semibold px-2 py-1 w-[12ch] text-center' />
              active users
            </div>
            <p>---</p>

          </div>


          {/* if greenfield project */}
          <div className="space-y-2">

            <p>---For greenfield projects---</p>
            <div className="flex flex-row gap-x-2 items-center">
              <label htmlFor="proj-age">I want this project to launch by:</label>
              <input placeholder={placeHolderLaunchYear()} id="proj-age" className='bg-ctp-crust rounded font-semibold px-2 py-1 w-[6ch] text-center' />
            </div >

            <div className="flex flex-row gap-x-2 items-center">
              <label htmlFor="proj-user-count">I expect to serve:</label>
              <input placeholder="10 Million" id="proj-user-count" className='bg-ctp-crust rounded font-semibold px-2 py-1 w-[12ch] text-center' />
              active users
            </div>
            <p>---</p>

          </div >

          <div className="flex flex-row gap-x-2 items-center">
            <label htmlFor="proj-ops">You&apos;d be working:</label>
            <select name="proj-ops" id="proj-ops" className="bg-ctp-crust rounded font-semibold w-fit px-2 py-1 text-center">
              <option value="">--select a working group type--</option>
              <option value="team">with my team</option>
              <option value="greenfield">with your team (sub-contractors)</option>
              <option value="greenfield">with both my team and your team</option>
              <option value="greenfield">as a lone wolf (tiny project)</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-y-2">
            <label htmlFor="proj-description">Please give a brief overview of your project, whilst specifying any hard-requirements.</label>
            <textarea id="proj-description" name="proj-description" placeholder="I need your help to launch a food delivery app. It NEEDS to support XYZ alternative payment systems, with a focus on serving..." rows={6} className="bg-ctp-crust p-4 rounded" />
          </div>

        </form >
      </div >
    </main >
  );
}

/*
 * More menu opts
 *
 * Questions:
 * - Have you worked with a Software Developer before? How was the experience?
 * - We're you referred to me by someone? If so, who?
 * - Is there anything you'd like to share about yourself, that you want me to know?
 * - 
 **/
