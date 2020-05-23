import React from 'react'
import { View, Slider as SliderCompo, Text } from 'react-native'

export default function Slider({ max, unit, step, value, onChange }) {
    return (
        <View>
            <SliderCompo
                step={step}
                value={value}
                maximumValue={max}
                minimumValue={0}
                onValueChange={onChange}
            />
            <View>
                <Text>{value}</Text>
                <Text>{unit}</Text>
            </View>
        </View>
    )
}
