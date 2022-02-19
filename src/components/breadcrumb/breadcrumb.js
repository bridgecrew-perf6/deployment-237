import React from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link } from "react-router-dom";

export default function ActiveLastBreadcrumb(props) {
  const { category, title } = props;
  return (
    <Breadcrumbs aria-label="breadcrumb" className="text-white" color="white">
      <Link to="/">
        <div className="text-white cursor-pointer">Event Mania</div>
      </Link>
      <Link to={"/" + category}>
        <span className="text-white capitalize">{category}</span>
      </Link>
      <Link to="/event">
        <span className="text-white">{title}</span>
      </Link>
      {/* <Link
        color="textPrimary"
        href="/components/breadcrumbs/"
        onClick={handleClick}
        aria-current="page"
      >
        Breadcrumb
      </Link> */}
    </Breadcrumbs>
  );
}
