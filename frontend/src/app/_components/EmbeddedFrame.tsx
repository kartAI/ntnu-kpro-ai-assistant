import React from 'react';

interface IframeProps {
  src: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  frameBorder?: number;
  allowFullScreen?: boolean;
}

const EmbeddedFrame: React.FC<IframeProps> = ({
  src,
  title = 'Embedded Frame',
  width = '90%',
  height = '600vh',
  allowFullScreen = false,
  ...props
}) => {
  return (
    <iframe
      src={src}
      title={title}
      width={width}
      height={height}
      allowFullScreen={allowFullScreen}
    
      {...props}
    ></iframe>
  );
};

export default EmbeddedFrame;
