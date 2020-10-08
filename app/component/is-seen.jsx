import React, { Component } from "react";
import { graphql } from "../../helper/api-helper";
import PropTypes from "prop-types";

export function addIsSeen(user_id, type, entity_id) {
  let q = `mutation { 
    add_is_seen (user_id:${user_id}, type:"${type}", entity_id:${entity_id}, is_seen:1) 
    { ID } }`

  // console.log("addIsSeen", q)
  return graphql(q);
}