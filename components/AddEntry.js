import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import Slider from './Slider'
import Stepper from './Stepper'
import DateHeader from './DateHeader'
import { FontAwesome } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'
import { white, purple } from '../utils/colors'

function Submit({ onPress }) {
    return (
        <TouchableOpacity
            style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
            onPress={onPress}>
            <Text style={styles.submitBtnText}>SUBMIT</Text>
        </TouchableOpacity>
    )
}

class AddEntry extends Component {

    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0
    }

    increment = (metric) => {
        const { max, step } = getMetricMetaInfo(metric)

        this.setState((preState) => {
            const count = this.state[metric] + step

            return {
                ...preState,
                [metric]: count > max ? max : count
            }
        })
    }

    decrement = (metric) => {

        this.setState((preState) => {
            const count = this.state[metric] - getMetricMetaInfo(metric).step

            return {
                ...preState,
                [metric]: count < 0 ? 0 : count
            }
        })
    }

    slider = (metric, value) => {
        this.setState(() => ({
            [metric]: value,
        }))
    }

    submit = () => {
        const key = timeToString()
        const entry = this.state

        this.props.dispatch(addEntry({
            [key]: entry
        }))

        this.setState(() => ({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0
        }))

        submitEntry({ key, entry })
    }

    reset = () => {
        const key = timeToString()

        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()
        }))

        removeEntry(key)
    }

    render() {
        const metaInfo = getMetricMetaInfo()

        if (this.props.alreadyLogged) {
            return (
                <View style={styles.center}>
                    <FontAwesome
                        name='smile-o'
                        size={100}
                    />
                    <Text>You already logged your information for today</Text>
                    <TextButton onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <DateHeader date={(new Date()).toLocaleDateString()} />
                {Object.keys(metaInfo).map(key => {
                    const { getIcon, type, ...rest } = metaInfo[key]
                    const value = this.state[key]

                    return (
                        <View key={key} style={styles.row}>
                            {getIcon()}
                            {type === 'slider'
                                ? <Slider
                                    value={value}
                                    onChange={(value) => this.slider(key, value)}
                                    {...rest}
                                />
                                : <Stepper
                                    value={value}
                                    onIncrement={() => this.increment(key)}
                                    onDecrement={() => this.decrement(key)}
                                    {...rest}
                                />}
                        </View>
                    )
                })}
                <Submit onPress={this.submit} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 35,
        backgroundColor: white
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    iosSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40
    },
    androidSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        height: 45,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: 'center'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30,
    }
})

function mapStateToProps(state) {
    const key = timeToString()

    return {
        alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}

export default connect(mapStateToProps)(AddEntry)