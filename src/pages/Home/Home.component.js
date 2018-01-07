// @flow

import React, { Component } from "react";
import { Text, View, Dimensions, StyleSheet, ART } from "react-native";
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Axis from "d3-axis";
import differenceInDays from "date-fns/difference_in_days";

import { Page } from "d3formation/src/components";
import data from "d3formation/src/data/data.json";

const { Surface, Group, Shape } = ART;

const interpersonalSkill = data.skills.interpersonal;
const numberActivites = interpersonalSkill.length - 1;
const firstDate = interpersonalSkill[0].date;
const lastDate = interpersonalSkill[numberActivites].date;
const XDomain = [0, differenceInDays(lastDate, firstDate)];

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default class Home extends Component {
  setTimeScale = dateValue => {
    const x = d3Scale
      .scaleTime()
      .domain(XDomain)
      .range([0, screenWidth / 2]);
    return x(dateValue);
  };

  setSkillScale = skillValue => {
    const y = d3Scale
      .scaleLinear()
      .domain([0, 20])
      .range([screenHeight / 2, 0]);
    return y(skillValue);
  };

  setShape = data => {
    const line = d3Shape
      .line()
      .x(d => this.setTimeScale(differenceInDays(d.date, firstDate)))
      .y(d => this.setSkillScale(d.value))
      .curve(d3Shape.curveCatmullRom.alpha(0.5));
    return line(data);
  };

  getAxisTicks = data => {
    const ticks = data.skills.interpersonal.map(datum => ({
      x: this.setTimeScale(differenceInDays(datum.date, firstDate)),
      y: this.setSkillScale(datum.value)
    }));
    return ticks;
  };

  displayAxis = data => {
    return (
      <View style={styles.xAxisContainer}>
        <View style={styles.xAxisline} />
        <View style={{ flexDirection: "row" }}>
          {this.getAxisTicks(data).map((tick, index) => {
            return (
              <View key={index}>
                <View style={styles.xAxisTicks} />
                <Text style={styles.text}>{Math.round(tick.x)}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  render() {
    return (
      <View>
        <Surface width={screenWidth} height={screenHeight}>
          <Group x={100} y={0}>
            <Shape
              d={this.setShape(data.skills.interpersonal)}
              stroke="gray"
              strokeWidth={2}
            />
            <Shape
              d={this.setShape(data.skills.verbal_linguistic)}
              stroke="red"
              strokeWidth={2}
            />
            <Shape
              d={this.setShape(data.skills.naturalistic)}
              stroke="green"
              strokeWidth={2}
            />
          </Group>
        </Surface>
        {this.displayAxis(data)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  xAxisContainer: {
    position: "absolute",
    top: 284,
    left: 99,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  xAxisline: { height: 2, width: 170, backgroundColor: "black" },
  xAxisTicks: {
    height: 10,
    width: 1,
    backgroundColor: "black"
  },
  text: { paddingRight: 10 }
});
