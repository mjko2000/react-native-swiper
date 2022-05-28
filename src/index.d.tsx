import type { FC } from 'react';

import { ViewStyle, View } from 'react-native';
import React from 'react-native/node_modules/@types/react';

type SwiperProps = {
  data: Array<any>;
  renderPage: (item: any, index: number) => JSX.Element;
  width?: number;
  height?: number;
  style?: ViewStyle;
  pageContainerStyle?: ViewStyle;
  dotContainerStyle?: ViewStyle;
  dotStyle?: ViewStyle;
  activeDotStyle?: ViewStyle;
  activeDotColor?: string;
  dotSeperatorWidth?: number;
  unActiveDotColor?: string;
  autoScroll?: boolean;
  renderPrevious?: () => JSX.Element;
  renderNext?: () => JSX.Element;
  loop?: boolean;
  nextContainerStyle?: ViewStyle;
  previousContainerStyle?: ViewStyle;
};

// type PagingDotProps = {
//   length: number;
//   activeIndex: number;
//   dotContainerStyle?: ViewStyle;
//   dotStyle?: ViewStyle;
//   activeDotStyle?: ViewStyle;
//   activeDotColor?: string;
//   unActiveDotColor?: string;
//   dotSeperatorWidth?: number;
// };

// type SwiperRef = Ref<{ scrollTo: (page: number) => void }>;

const Swiper: FC<SwiperProps> = (props) => {
  return <View {...props} />;
};

export default Swiper;
