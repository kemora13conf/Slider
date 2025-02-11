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
  nextButton?: ReactNode;
  prevButton?: ReactNode;
  pas: number;
  list: Array<any>;
  renderer: (item: any, index: number) => ReactNode;
}

const useSliderState = (pas: number, list: Array<any>) => {
  const [itemsTorender, setItemsToRender] = useState<Array<any>>([]);
  const [originalList, setOriginalList] = useState<Array<any>>([]);
  const [currentItem, setCurrentItem] = useState(0);
  const refToItemsInView = useRef<HTMLDivElement>(null);
  const refToItemOutOfView = useRef<HTMLDivElement>(null);

  const next = useCallback(() => {
    if (currentItem + pas < list.length) {
      setCurrentItem((prev) => prev + pas);
    }
  }, [currentItem, list.length, pas]);

  const prev = useCallback(() => {
    if (currentItem - pas >= 0) {
      setCurrentItem((prev) => prev - pas);
    }
  }, [currentItem, pas]);

  useEffect(() => {
    setOriginalList(list);
  }, [list]);

  useEffect(() => {
    if(itemsTorender.length < originalList.length){
      const items = originalList.slice(currentItem, currentItem + pas);
      setItemsToRender(prev => [...prev,...items]);
    } else {
      const itemsFromStart = itemsTorender.slice(0, pas);
    } 
  }, [currentItem, originalList, pas]);

  return {
    prev,
    next,
    currentItem,
    pas,
    refToItemsInView,
    refToItemOutOfView,
  };
};

export const Slider: React.FC<SliderProps> = ({
  nextButton,
  prevButton,
  pas,
  list,
  renderer,
}) => {};
