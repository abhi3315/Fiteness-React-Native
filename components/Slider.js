import React from 'react'
import { View, Slider as SliderComponent, Text } from 'react-native'

export default function Slider({ max, unit, step, value, onChange }) {
    return (
        <View>
            <SliderComponent
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
