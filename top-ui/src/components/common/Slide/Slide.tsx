import React from 'react';
import { Slide as MuiSlide, SlideProps as MuiSlideProps } from '@mui/material';

export type SlideProps = MuiSlideProps;

const Slide = React.forwardRef<unknown, SlideProps>((props, ref) => {
  return <MuiSlide ref={ref} {...props} />;
});

Slide.displayName = 'Slide';

export default Slide;
