import React from 'react';

interface IframeProps {
  src: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  frameBorder?: number;
  allowFullScreen?: boolean;
}

const EmbeddedPlan: React.FC<IframeProps> = ({
  src,
  title = 'Embedded Frame',
  width = '60%',
  height = '500vh',
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

export default EmbeddedPlan;
