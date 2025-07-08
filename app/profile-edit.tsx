import { CircleRadialGradient } from "@/components/radial-gradient";
import { InputTextGradient } from "@/components/text-gradient";
import { useEnteringBottomAnimation } from "@/hooks/animations";
import LayoutBackground, { stylesLayout } from "@/layout/background";
import {
  DEFAULT_COLOR,
  DEFAULT_IMAGE_URI,
  DEFAULT_KEY_COLOR,
  DEFAULT_KEY_IMAGE_URI,
  setStorageImageUri,
  themeColors,
} from "@/theme/theme-storage";
import { getKeysTypedObject } from "@/utils/helper";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { CameraIcon, CheckIcon } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  Pressable,
} from "react-native-gesture-handler";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { useMMKVString } from "react-native-mmkv";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  runOnJS,
} from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// const blurhash =
// 	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Page() {
  const { height } = useReanimatedKeyboardAnimation();
  const inputRef = useRef<TextInput>(null);
  const [animating, setAnimating] = useState(true);
  const [imageUri] = useMMKVString(DEFAULT_KEY_IMAGE_URI);
  const [themeColor, setThemeColor] = useMMKVString(DEFAULT_KEY_COLOR);
  const themeColorFinal =
    (themeColor as keyof typeof themeColors) ?? DEFAULT_COLOR;
  const enteringAnimation = useEnteringBottomAnimation(() => {
    "worklet";
    runOnJS(setAnimating)(false);
  });

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-20, 20])
        .onEnd((event) => {
          // swipe left only
          if (event.translationX > 50) {
            runOnJS(router.replace)("/profile");
          }
        }),
    [],
  );

  useEffect(() => {
    // const animationFrame = requestAnimationFrame(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 700);
    // });

    // return () => {
    // 	cancelAnimationFrame(animationFrame);
    // };
  }, []);

  const handleThemeChange = useCallback(
    (color: keyof typeof themeColors) => {
      if (animating) return;
      setThemeColor(color);
    },
    [animating],
  );

  const pickImage = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      selectionLimit: 1,
    });

    if (result.canceled || result.assets[0].type !== "image") return;
    setStorageImageUri(result.assets[0].uri);
  }, []);

  return (
    <GestureDetector gesture={panGesture}>
      <LayoutBackground color={themeColorFinal} centeredContent>
        <Animated.View
          style={StyleSheet.flatten([
            stylesLayout.centerContent,
            { transform: [{ translateY: height }] },
          ])}
        >
          <View style={stylesLayout.containerWithGap}>
            <Animated.View
              style={StyleSheet.flatten([
                stylesLayout.centerContent,
                stylesLayout.shadowImage,
              ])}
              entering={FadeInDown.duration(800).delay(200).springify()}
            >
              <Pressable onPress={pickImage}>
                <Image
                  style={stylesLayout.image}
                  contentFit="cover"
                  source={imageUri ?? DEFAULT_IMAGE_URI}
                  placeholderContentFit="cover"
                  placeholder={{ uri: DEFAULT_IMAGE_URI }}
                  transition={{
                    duration: 300,
                    // effect: "flip-from-top",
                  }}
                />
                <View style={styles.cameraButton}>
                  <CameraIcon
                    fill={themeColors[themeColorFinal].primary}
                    color="#fff"
                    size={26}
                  />
                </View>
              </Pressable>

              <CircleRadialGradient
                offset="80%"
                icon={null}
                color={themeColors[themeColorFinal].primary}
                style={StyleSheet.flatten([
                  stylesLayout.gradientHalo,
                  stylesLayout.bigHalo,
                ])}
              />

              <CircleRadialGradient
                offset="80%"
                icon={null}
                color={themeColors[themeColorFinal].primary}
                style={StyleSheet.flatten([
                  stylesLayout.gradientHalo,
                  stylesLayout.smallHalo,
                ])}
              />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.duration(800).delay(150).springify()}
            >
              <InputTextGradient
                color={themeColorFinal}
                style={{ fontSize: 55 }}
                ref={inputRef as any}
              />
            </Animated.View>
          </View>

          <Animated.View
            style={StyleSheet.flatten([
              stylesLayout.topButtons,
              stylesLayout.topRightButton,
              {
                backgroundColor: themeColors[themeColorFinal].secondary,
              },
            ])}
            entering={FadeInDown.duration(800).delay(200).springify()}
          >
            <Pressable
              onPress={() => {
                router.replace("/profile");
              }}
              style={stylesLayout.paddingTopButtons}
            >
              <CheckIcon size={26} color="#fff" />
            </Pressable>
          </Animated.View>

          <AnimatedBlurView
            style={StyleSheet.flatten([
              stylesLayout.bottomButton,
              styles.buttons,
            ])}
            entering={enteringAnimation()}
            exiting={FadeOut.duration(600)}
            intensity={10}
          >
            {getKeysTypedObject(themeColors).map((color) => (
              <CircleRadialGradient
                onPress={() => {
                  handleThemeChange(color);
                }}
                key={color}
                icon={
                  themeColorFinal === color ? (
                    <Animated.View entering={FadeIn.duration(600)}>
                      <CheckIcon size={28} color="#fff" />
                    </Animated.View>
                  ) : null
                }
                color={themeColors[color].primary}
              />
            ))}
          </AnimatedBlurView>
        </Animated.View>
      </LayoutBackground>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    gap: 17,
    padding: 8,
    borderWidth: 1,
    borderColor: "#fff",
    maxWidth: "100%",
    width: "auto",
    backgroundColor: "rgba(195, 176, 180, 0.5)",
    overflow: "hidden",
  },
  cameraButton: {
    width: 40,
    aspectRatio: 1,
    zIndex: 9,
    borderWidth: 1,
    borderColor: "#fff",
    position: "absolute",
    right: 2,
    top: 2,
    borderRadius: 99,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    boxShadow: "inset 0 0 9px 0 #fff",
    justifyContent: "center",
    alignItems: "center",
  },
  blurImage: {
    width: 140,
    aspectRatio: 1,
    position: "absolute",
    zIndex: 8,
    left: 0,
    top: 0,
    borderRadius: 99,
    opacity: 0.9,
  },
});
