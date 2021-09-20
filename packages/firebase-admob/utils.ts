import {ManagerRequestOptions, RequestOptions} from "./common";

export function toSerializeRequestOptions(requestOptions?: RequestOptions, isManager: boolean = false) {
  if (global.isAndroid) {
    return null;
  }
  const request = isManager ? GADRequest.request() : GAMRequest.request();

  if (requestOptions?.contentUrl) {
    request.contentURL = requestOptions?.contentUrl;
  }

  if (requestOptions?.keywords) {
    request.keywords = requestOptions?.keywords as any;
  }

  if (requestOptions?.location) {
    request.setLocationWithLatitudeLongitudeAccuracy(requestOptions?.location[0], requestOptions?.location[1], requestOptions?.locationAccuracy);
  }

  const nativeExtras = GADExtras.new();
  let extras = {};

  if (requestOptions?.requestNonPersonalizedAdsOnly) {
    extras['npa'] = '1';
  }

  if (requestOptions?.networkExtras) {
    extras = Object.assign(extras, requestOptions?.networkExtras);
  }

  nativeExtras.additionalParameters = extras as any;
  request.registerAdNetworkExtras(nativeExtras);

  if (requestOptions?.requestAgent) {
    request.requestAgent = requestOptions?.requestAgent;
  }
  return request;
}

export function toSerializeManagerRequestOptions(requestOptions?: ManagerRequestOptions) {

  if (global.isAndroid) {
    return null;
  }

  const request = toSerializeRequestOptions(requestOptions, true) as GAMRequest;

  if (requestOptions.publisherProvidedId) {
    request.publisherProvidedID = requestOptions.publisherProvidedId;
  }

  if (requestOptions.customTargeting) {
    request.customTargeting = requestOptions.customTargeting as any;
  }

  if (Array.isArray(requestOptions.categoryExclusions)) {
    request.categoryExclusions = requestOptions.categoryExclusions as any;
  }

  return request;
}


export const topViewController = (): UIViewController | undefined => {
  if (global.isAndroid) {
    return undefined;
  }
  const root = rootViewController();
  if (root == null) {
    return undefined;
  }
  return findTopViewController(root);
};


const rootViewController = (): UIViewController | undefined => {
  const keyWindow = UIApplication.sharedApplication.keyWindow;
  return keyWindow != null ? keyWindow.rootViewController : undefined;
};


const findTopViewController = (root: UIViewController): UIViewController | undefined => {
  const presented = root.presentedViewController;
  if (presented != null) {
    return findTopViewController(presented);
  }
  if (root instanceof UISplitViewController) {
    const last = root.viewControllers.lastObject;
    if (last == null) {
      return root;
    }
    return findTopViewController(last);
  } else if (root instanceof UINavigationController) {
    const top = root.topViewController;
    if (top == null) {
      return root;
    }
    return findTopViewController(top);
  } else if (root instanceof UITabBarController) {
    const selected = root.selectedViewController;
    if (selected == null) {
      return root;
    }
    return findTopViewController(selected);
  } else {
    return root;
  }
};
