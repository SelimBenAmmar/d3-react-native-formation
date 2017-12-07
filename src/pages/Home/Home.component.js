// @flow

import React, { Component } from "react";
import { Text, View, Dimensions, ART } from "react-native";
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import differenceInDays from "date-fns/difference_in_days";

import { Page } from "d3formation/src/components";
import data from "d3formation/src/data/data.json";

import styles from "./Home.style";

const { Surface, Group, Shape } = ART;

const interpersonalSkill = data.skills.interpersonal;
const numberActivites = interpersonalSkill.length - 1;
const firstDate = interpersonalSkill[0].date;
const lastDate = interpersonalSkill[numberActivites].date;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default class Home extends Component {
  setTimeScale = dateValue => {
    const Xaxis = [0, differenceInDays(lastDate, firstDate)];

    const x = d3Scale
      .scaleTime()
      .domain(Xaxis)
      .range([0, screenWidth]);
    return x(differenceInDays(dateValue, firstDate));
  };

  setSkillScale = skillValue => {
    const y = d3Scale
      .scaleLinear()
      .domain([0, 20])
      .range([0, screenHeight]);
    return y(skillValue);
  };

  setShape = data => {
    const line = d3Shape
      .line()
      .x(d => this.setTimeScale(d.date))
      .y(d => this.setSkillScale(d.value))
      .curve(d3Shape.curveCatmullRom.alpha(0.5));
    return line(data);
  };

  render() {
    return (
      <View>
        <Surface width={screenWidth} height={screenHeight}>
          <Group x={100} y={0}>
            <Shape
              d={this.setShape(data.skills.interpersonal)}
              stroke="#000"
              strokeWidth={1}
            />
          </Group>
        </Surface>
      </View>
    );
  }
}
