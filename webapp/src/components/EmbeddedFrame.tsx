import React from 'react';

interface IframeProps {
  src: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  frameBorder?: number;
  allowFullScreen?: boolean;
  className?: string;
}

const EmbeddedFrame: React.FC<IframeProps> = ({
  src,
  title = 'Embedded Frame',
  width = '90%',
  height = '600vh',
  allowFullScreen = false,
  className = '',
  ...props
}) => {
  return (
    <iframe
      src={src}
      title={title}
      width={width}
      height={height}
      allowFullScreen={allowFullScreen}
      className={`${className} h-screen`} 
      {...props}
    ></iframe>
  );
};

export default EmbeddedFrame;