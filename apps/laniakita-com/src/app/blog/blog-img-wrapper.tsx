import { toBase64Blur } from "@/utils/blur-util";
import BlogImage from "./client-blog-image";

interface ImgProps {
  src: string;
  alt: string;
}
export default async function BlogImgWrapper(props: ImgProps) {
  const imgRes = await toBase64Blur(props.src)
  return <BlogImage props={props} blurUrl={imgRes} />
}
