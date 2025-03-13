import { Easing, FadeInDown } from "react-native-reanimated";
import { useCallback } from "react";


export function useEnteringBottomAnimation(callback?: any) {
	return useCallback(
		() =>
			FadeInDown.duration(600)
				.delay(300)
				.easing(Easing.inOut(Easing.ease))
				.springify()
				.stiffness(100)
				.damping(16)
				.withInitialValues({
					opacity: 0,
					transform: [{ translateY: 100 }],
				})
				.withCallback(callback),
		[]
	);
}

export function useEnteringTopAnimation() {
	return useCallback(() => FadeInDown.duration(800).delay(200).springify(), []);
}
