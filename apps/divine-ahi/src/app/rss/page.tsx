import { toXML } from "jstoxml";
import { blogPostFinder } from "@/lib/postUtils";
/*
const blogPosts = await blogPostFinder()
console.log(blogPosts)
*/
const feedSetup = {
  title: `Lani Akita's Dev Blog`,
  link: "https://laniakita.com/blog",
  description:
    "Dive into the details of all the latest technologies Lani's learning, using, and forming opinions on to build modern applications for the web.",
  language: "en-us",
  copyright: `Copyright ${new Date().getFullYear() == 2024 ? "2024" : `2024-${new Date().getFullYear}`}, Lani Akita`,
  managingEditor: 'lani@laniakita.com',
  webMaster: 'Lani Akita',

};

export default function Page() {
  return <div>This is where the RSS feed will go.</div>;
}
