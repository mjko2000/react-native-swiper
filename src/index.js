import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React, {
  memo,
  useCallback,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

const Swiper = (props, ref) => {
  const {
    data: dataProps,
    renderPage,
    width,
    height,
    style,
    pageContainerStyle,
    dotContainerStyle,
    dotStyle,
    activeDotStyle,
    activeDotColor,
    dotSeperatorWidth,
    unActiveDotColor,
    autoScroll,
    renderPrevious,
    renderNext,
    loop,
    nextContainerStyle,
    previousContainerStyle,
  } = props;
  const [data, setData] = useState(dataProps);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const trueLength = dataProps.length;
  const scrollRef = useRef();

  useImperativeHandle(ref, () => ({
    scrollTo: (page) => {
      scrollRef.current.scrollTo({
        y: 0,
        x: pageWidth * page,
        animated: false,
      });
    },
  }));
  useEffect(() => {
    let parsedData = [...dataProps];
    if (loop) {
      parsedData = [...dataProps, ...dataProps, ...dataProps];
    }
    setData(parsedData);
  }, [dataProps, loop]);

  useEffect(() => {
    if (data.length > trueLength) {
      setTimeout(
        () =>
          scrollRef.current.scrollTo({
            y: 0,
            x: trueLength * pageWidth,
            animated: false,
          }),
        100
      );
      setActiveIndex(trueLength);
    }
  }, [data, pageWidth, trueLength]);

  useEffect(() => {
    let timeout;
    if (autoScroll && trueLength) {
      timeout = setTimeout(() => {
        setActiveIndex((index) => {
          let page = index + 1;
          if (!loop) {
            page = index === trueLength - 1 ? 0 : index + 1;
          }
          scrollRef.current.scrollTo({
            y: 0,
            x: pageWidth * page,
            animated: true,
          });
          return page;
        });
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [autoScroll, pageWidth, data, activeIndex, loop, trueLength]);

  const renderMemoPages = useMemo(() => {
    return data.map((item, index) => (
      <View
        style={[
          styles.pageContainer,
          { width: pageWidth || undefined },
          pageContainerStyle,
        ]}
      >
        {renderPage && renderPage(item, index % trueLength)}
      </View>
    ));
  }, [data, renderPage, pageWidth, pageContainerStyle, trueLength]);

  const onLayout = useCallback((e) => {
    setPageWidth(e.nativeEvent.layout.width);
    setPageHeight(e.nativeEvent.layout.height);
  }, []);

  const scrollToPage = (page, animated) => {
    scrollRef.current.scrollTo({ x: pageWidth * page, y: 0, animated });
    setActiveIndex(page);
  };

  const onMomentumScrollEnd = useCallback(
    (e) => {
      const activeIndex = e.nativeEvent.contentOffset.x / pageWidth;
      setActiveIndex(activeIndex);
      if (loop) {
        if (activeIndex >= trueLength * 2) {
          scrollToPage(trueLength, false);
        }
        if (activeIndex <= trueLength - 1) {
          scrollToPage(trueLength * 2 - 1, false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageWidth, trueLength, loop]
  );

  const onPressPrevious = useCallback(() => {
    setActiveIndex((index) => {
      const page = index === 0 ? data.length - 1 : index - 1;
      scrollRef.current.scrollTo({
        y: 0,
        x: pageWidth * page,
        animated: true,
      });
      return page;
    });
  }, [data, pageWidth]);

  const onPressNext = useCallback(() => {
    setActiveIndex((index) => {
      const page = index >= data.length - 1 ? 0 : index + 1;
      scrollRef.current.scrollTo({
        y: 0,
        x: pageWidth * page,
        animated: true,
      });
      return page;
    });
  }, [data, pageWidth]);
  const styleMemo = useMemo(
    () => ({ ...style, width, height }),
    [style, width, height]
  );
  return (
    <View style={styleMemo}>
      <ScrollView
        ref={scrollRef}
        onLayout={onLayout}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={[styles.container, styleMemo]}
      >
        {renderMemoPages}
      </ScrollView>
      <PagingDot
        length={trueLength}
        activeIndex={activeIndex % trueLength}
        dotContainerStyle={dotContainerStyle}
        dotStyle={dotStyle}
        activeDotStyle={activeDotStyle}
        activeDotColor={activeDotColor}
        unActiveDotColor={unActiveDotColor}
        dotSeperatorWidth={dotSeperatorWidth}
      />
      {renderPrevious && (
        <TouchableOpacity
          onPress={onPressPrevious}
          style={[
            styles.previous,
            {
              bottom: pageHeight / 2 - 20,
            },
            previousContainerStyle,
          ]}
        >
          {renderPrevious()}
        </TouchableOpacity>
      )}
      {renderNext && (
        <TouchableOpacity
          onPress={onPressNext}
          style={[
            styles.next,
            {
              bottom: pageHeight / 2 - 20,
            },
            nextContainerStyle,
          ]}
        >
          {renderNext()}
        </TouchableOpacity>
      )}
    </View>
  );
};

const PagingDot = ({
  length,
  activeIndex,
  dotContainerStyle,
  dotStyle,
  activeDotStyle,
  activeDotColor,
  unActiveDotColor,
  dotSeperatorWidth,
}) => {
  return (
    <View style={[styles.dotContainer, dotContainerStyle]}>
      {new Array(length).fill(1).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <>
            <View
              style={[
                styles.dot,
                dotStyle,
                isActive && activeDotStyle,
                {
                  backgroundColor: isActive
                    ? activeDotColor || 'blue'
                    : unActiveDotColor || '#00000030',
                },
              ]}
            />
            {index < length - 1 && (
              <View
                style={
                  dotSeperatorWidth
                    ? { width: dotSeperatorWidth }
                    : styles.dotSeperator
                }
              />
            )}
          </>
        );
      })}
    </View>
  );
};
Swiper.propTypes = {
  data: PropTypes.array.isRequired,
  renderPage: () => PropTypes.element,
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  pageContainerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  dotContainerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  dotStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  activeDotStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  activeDotColor: PropTypes.string,
  dotSeperatorWidth: PropTypes.number,
  unActiveDotColor: PropTypes.string,
  autoScroll: PropTypes.bool,
  renderPrevious: () => PropTypes.element,
  renderNext: () => PropTypes.element,
  loop: PropTypes.bool,
  nextContainerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  previousContainerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};
const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  pageContainer: { alignItems: 'center', overflow: 'hidden' },
  dotContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 10,
    alignSelf: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotSeperator: { width: 6 },
  next: {
    position: 'absolute',
    right: 0,
    width: 50,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  previous: {
    position: 'absolute',
    left: 0,
    width: 50,
    height: 40,
    justifyContent: 'center',
  },
});

export default memo(forwardRef(Swiper));
