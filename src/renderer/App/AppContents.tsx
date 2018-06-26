import "!style-loader!css-loader!../fonts/icomoon/style.css";
import "!style-loader!css-loader!../fonts/lato/latofonts-custom.css";
import "!style-loader!css-loader!react-hint/css/index.css";
import "!style-loader!css-loader!react-json-inspector/json-inspector.css";
import "!style-loader!css-loader!react-tabs/style/react-tabs.css";
import { Dispatch } from "common/types";
import { rendererWindow } from "common/util/navigation";
import React from "react";
import Layout from "renderer/App/Layout";
import Modals from "renderer/App/Modals";
import { doesEventMeanBackground } from "renderer/helpers/whenClickNavigates";
import { actions } from "common/actions";
import { hook } from "renderer/hocs/hook";

class AppContents extends React.PureComponent<Props> {
  render() {
    return (
      <div onClickCapture={this.onClickCapture}>
        <Layout />
        <Modals />
      </div>
    );
  }

  onClickCapture = (e: React.MouseEvent<HTMLElement>) => {
    this.handleClickCapture(e, e.target as HTMLElement);
  };

  handleClickCapture(e: React.MouseEvent<HTMLElement>, target: HTMLElement) {
    if (!target) {
      return;
    }

    if (target.tagName == "A") {
      const link = target as HTMLLinkElement;
      const href = link.href;
      e.preventDefault();
      e.stopPropagation();
      const { dispatch } = this.props;
      dispatch(
        actions.navigate({
          window: rendererWindow(),
          url: href,
          background: doesEventMeanBackground(e),
          replace: link.target === "_replace",
        })
      );
    } else {
      this.handleClickCapture(e, target.parentElement);
    }
  }
}

interface Props {
  dispatch: Dispatch;
}

export default hook()(AppContents);