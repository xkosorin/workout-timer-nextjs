import React from "react";
import Image from "next/image";
import { getYoutubeVideId } from "../utils/helpers";

type Props = {
  mediaURL: string | undefined;
  mediaIsImage: boolean | undefined;
  showThumbnail?: boolean;
  width?: number;
  height?: number;
};

const ExerciseMedia: React.FC<Props> = (props: Props) => {
  const IMAGE_PLACEHOLDER =
    "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

  if (props.mediaURL === undefined) {
    return props.width && props.height ? (
      <Image
        width={`${props.width}`}
        height={`${props.height}`}
        layout="responsive"
        src={IMAGE_PLACEHOLDER}
        alt="Exercise media is missing."
      />
    ) : (
      <Image
        layout="fill"
        src={IMAGE_PLACEHOLDER}
        alt="Exercise media is missing."
      />
    );
  }

  if (props.mediaIsImage) {
    return props.width && props.height ? (
      <Image
        width={`${props.width}`}
        height={`${props.height}`}
        layout="responsive"
        src={props.mediaURL}
        alt="Exercise image."
      />
    ) : (
      <Image layout="fill" src={props.mediaURL} alt="Exercise image." />
    );
  }

  let videoId = getYoutubeVideId(props.mediaURL);
  if (props.showThumbnail) {
    if (videoId) {
      return props.width && props.height ? (
        <Image
          width={`${props.width}`}
          height={`${props.height}`}
          layout="responsive"
          src={`http://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
          alt="Exercise image."
        />
      ) : (
        <Image
          layout="fill"
          src={`http://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
          alt="Exercise image."
        />
      );
    }
    return <Image src={IMAGE_PLACEHOLDER} alt="Exercise media is missing." />;
  } else {
    return (
      <iframe
        id="ytplayer"
        width={`${props.width || "360"}`}
        height={`${props.height || "360"}`}
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Youtube video"
      />
    );
  }
};

export default ExerciseMedia;
