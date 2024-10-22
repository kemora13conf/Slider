import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import "./Slider.css";

interface SliderContextType {
  prev: () => void;
  next: () => void;
  currentItem: number;
  pas: number;
  refToItemsInView: React.RefObject<HTMLDivElement>;
  refToItemOutOfView: React.RefObject<HTMLDivElement>;
}

const SliderContext = createContext<SliderContextType | undefined>(undefined);

export const useSliderContext = () => {
  const context = useContext(SliderContext);
  if (!context) {
    throw new Error("useSliderContext must be used within a SliderProvider");
  }
  return context;
};

interface SliderProps {
  children: ReactNode[];
  nextButton: ReactNode;
  prevButton: ReactNode;
  pas: number;
  isThereNewData: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  children,
  nextButton,
  prevButton,
  pas,
  isThereNewData,
}) => {
  const [currentItem, setCurrentItem] = useState(0);
  const [oldCurrentItem, setOldCurrentItem] = useState(0);
  const [showPrev, setShowPrev] = useState(false);
  const [originalItems, setOriginalItems] = useState<ReactNode[]>([]);
  const [items, setItems] = useState<ReactNode[]>([]);

  // Refs
  const refToItemsInView = useRef<HTMLDivElement>(null);
  const refToItemOutOfView = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const itemsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [itemChanged, setItemsChanged] = useState(true);

  const containerWidth = useMotionValue(0);

  const next = useCallback(() => {
    setCurrentItem((prev) => {
      const nextItem = prev + pas;
      setShowPrev(true);
      return nextItem;
    });
    if (sliderContainerRef.current) {
      const lastScrollX = sliderContainerRef.current.scrollLeft;
      if (itemsRefs.current[0]) {
        sliderContainerRef.current.scrollTo({
          left: lastScrollX + pas * itemsRefs.current[0].clientWidth,
          behavior: "smooth",
        });
      }
    }
  }, [pas]);

  const prev = useCallback(() => {
    setCurrentItem((prev) => {
      const prevItem = Math.max(0, prev - pas);
      if (sliderContainerRef.current) {
        const lastScrollX = sliderContainerRef.current.scrollLeft;
        if (itemsRefs.current[0]) {
          sliderContainerRef.current &&
            sliderContainerRef.current.scrollTo({
              left: lastScrollX + ( -pas - 1) * itemsRefs.current[0].clientWidth,
              behavior: "smooth",
            });
        }
      }
      return prevItem;
    });
  }, [pas]);

  useEffect(() => {
    if (isThereNewData) {
      setOriginalItems(children);
    }
  }, [children]);

  useEffect(() => {
    // if items changed, update itemChange state
    if (originalItems.length !== items.length) {
      setItemsChanged(true);
    } else {
      setItemsChanged(false);
    }
    setItems(originalItems);
  }, [originalItems]);

  useEffect(() => {
    console.log("currentItem", currentItem, "oldCurrentItem", oldCurrentItem);
    if (currentItem - pas * 3 < 0) {
      // we need to take pas * item from the end of the list and add it to the beginning
      // also we need to update currentItem and with that the scroll position of the slider
      setItems([...items, ...items]);
      setCurrentItem((prev) => {
        return prev + pas * 3;
      });
      // update the value of the scroll y of sliderContainerRef.current not the scrollTo
      setTimeout(() => {
        if (sliderContainerRef.current) {
          if (itemsRefs.current[0]) {
            sliderContainerRef.current.scrollTo({
              left: itemsRefs.current[0].clientWidth * pas * 3 + 1,
              behavior: "auto",
            });
          }
        }
      }, 150);
    }

    if (currentItem + pas * 2 >= items.length) {
      if (!itemChanged) {
        const newItems = [...items];
        const itemsToAdd = [];
        for (let i = 0; i < pas * 3; i++) {
          itemsToAdd.push(newItems[i]);
        }
        newItems.push(...items, ...itemsToAdd);
        setItems(newItems);
      }
    }

    setOldCurrentItem(currentItem);
  }, [currentItem, sliderContainerRef.current, items.length, itemChanged]);

  useEffect(() => {
    if (sliderContainerRef.current) {
      sliderContainerRef.current.addEventListener("mousewheel", (e: any) => {
        e.preventDefault();
      });
    }
    return () => {
      if (sliderContainerRef.current) {
        sliderContainerRef.current.removeEventListener(
          "mousewheel",
          (e: any) => {
            e.preventDefault();
          }
        );
      }
    };
  }, []);

  const contextValue: SliderContextType = {
    prev,
    next,
    currentItem,
    pas,
    refToItemsInView,
    refToItemOutOfView,
  };

  useEffect(() => {
    if (refToItemsInView.current && sliderRef.current) {
      sliderRef.current.style.height =
        refToItemsInView.current.clientHeight + "px";
      containerWidth.set(sliderRef.current.clientWidth);
    }
  }, [children.length, containerWidth]);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = containerWidth.get() / 4;
    if (info.offset.x < -threshold) {
      next();
    } else if (info.offset.x > threshold) {
      prev();
    }
  };

  //   const xInput = [-containerWidth.get(), 0, containerWidth.get()];
  //   const opacityOutput = [0, 1, 0];
  //   const opacity = useTransform(x, xInput, opacityOutput);

  return (
    <SliderContext.Provider value={contextValue}>
      <div className="Slider" ref={sliderRef}>
        <div className="prev-button-section">{showPrev && prevButton}</div>
        <div className="slides-container" ref={sliderContainerRef}>
          {items && (
            <motion.div
              ref={refToItemsInView}
              className="slides"
              // drag="x"
              // dragConstraints={{ left: 0, right: 0 }}
              // dragElastic={1}
              // onDragEnd={handleDragEnd}
              style={{
                x: useMotionValue(
                  -currentItem * (itemsRefs.current[0]?.clientWidth || 0)
                ),
              }}
            >
              {items.map((item, index) => (
                <motion.div
                  ref={(element) => (itemsRefs.current[index] = element)}
                  key={index}
                  className="slide"
                  id={`slide-${index}`}
                >
                  {item}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
        <div className="next-button-section">{nextButton}</div>
      </div>
    </SliderContext.Provider>
  );
};
