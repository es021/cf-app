import React from "react";
import { lang } from "../../lib/lang";

export function getFieldItemSingle({ id, label, input_type, is_required }) {
  return {
    type: "single",
    input_type: input_type,
    label: lang(label),
    id: id,
    key_input: id,
    is_required: is_required,
  }
}

export function getFieldItemMulti({ id, label, input_type, is_required, input_placeholder, dataset_suggestion }) {
  return {
    type: "multi",
    input_type: type,
    input_placeholder: input_placeholder,
    id: id,
    key_input: id,
    dataset_suggestion: dataset_suggestion,
    label: lang(label),
    is_required: is_required,
  }
}

