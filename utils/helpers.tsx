export const getYoutubeThumbnail = (url: string) => {
  var regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
    return "http://img.youtube.com/vi/" + match[2] + "/mqdefault.jpg";
  } else {
    return "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  }
};

export const getYoutubeVideId = (url: string) => {
  var regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return null;
  }
};
