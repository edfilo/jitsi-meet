//
//  AppDelegate.m
//  Backpack Chat
//
//  Created by Ed Filowat on 12/28/20.
//


#import "AppDelegate.h"
#import "FIRUtilities.h"
#import "Types.h"
#import "ViewController.h"

@import Firebase;
@import JitsiMeetSDK;


@implementation AppDelegate



-             (BOOL)application:(UIApplication *)application
  didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    JitsiMeet *jitsiMeet = [JitsiMeet sharedInstance];

    jitsiMeet.conferenceActivityType = JitsiMeetConferenceActivityType;
    jitsiMeet.customUrlScheme = @"org.jitsi.meet";
    jitsiMeet.universalLinkDomains = @[@"meet.jit.si", @"alpha.jitsi.net", @"beta.meet.jit.si", @"edsvbar.com"];

    jitsiMeet.defaultConferenceOptions = [JitsiMeetConferenceOptions fromBuilder:^(JitsiMeetConferenceOptionsBuilder *builder) {
    [builder setFeatureFlag:@"resolution" withValue:@(360)];
    builder.serverURL = [NSURL URLWithString:@"https://edsvbar.com"];
    builder.welcomePageEnabled = YES;
    builder.room = @"";


    [builder setFeatureFlag:@"calendar.enabled" withBoolean:NO];
    [builder setFeatureFlag:@"chat.enabled" withBoolean:NO];
    [builder setFeatureFlag:@"ios.recording.enabled" withBoolean:NO];

    }];

  [jitsiMeet application:application didFinishLaunchingWithOptions:launchOptions];

    // Initialize Crashlytics and Firebase if a valid GoogleService-Info.plist file was provided.

 // [FIRDynamicLink t]

  if ([FIRUtilities appContainsRealServiceInfoPlist]) {
        NSLog(@"Enabling Firebase");
        [FIRApp configure];
        // Crashlytics defaults to disabled wirth the FirebaseCrashlyticsCollectionEnabled Info.plist key.
        // [[FIRCrashlytics crashlytics] setCrashlyticsCollectionEnabled:![jitsiMeet isCrashReportingDisabled]];
    }


    ViewController *rootController = (ViewController *)self.window.rootViewController;
    [jitsiMeet showSplashScreen:rootController.view];

    return YES;
}

- (void) applicationWillTerminate:(UIApplication *)application {
    NSLog(@"Application will terminate!");
    // Try to leave the current meeting graceefully.
    ViewController *rootController = (ViewController *)self.window.rootViewController;
    [rootController terminate];
}

#pragma mark Linking delegate methods




-    (BOOL)application:(UIApplication *)application
  continueUserActivity:(NSUserActivity *)userActivity
    restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> *restorableObjects))restorationHandler {


    if ([FIRUtilities appContainsRealServiceInfoPlist]) {
        // 1. Attempt to handle Universal Links through Firebase in order to support
        //    its Dynamic Links (which we utilize for the purposes of deferred deep
        //    linking).


        BOOL handled
          = [[FIRDynamicLinks dynamicLinks]
                handleUniversalLink:userActivity.webpageURL
                         completion:^(FIRDynamicLink * _Nullable dynamicLink, NSError * _Nullable error) {
           NSURL *firebaseUrl = [FIRUtilities extractURL:dynamicLink];
           if (firebaseUrl != nil) {
             userActivity.webpageURL = firebaseUrl;
             [[JitsiMeet sharedInstance] application:application
                                continueUserActivity:userActivity
                                  restorationHandler:restorationHandler];
           }
        }];

        if (handled) {

          return handled;
        }
    }


    // 2. Default to plain old, non-Firebase-assisted Universal Links.
    return [[JitsiMeet sharedInstance] application:application
                              continueUserActivity:userActivity
                                restorationHandler:restorationHandler];
}

- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

    // This shows up during a reload in development, skip it.
    // https://github.com/firebase/firebase-ios-sdk/issues/233
    if ([[url absoluteString] containsString:@"google/link/?dismiss=1&is_weak_match=1"]) {
        return NO;
    }

    NSURL *openUrl = url;


    if ([FIRUtilities appContainsRealServiceInfoPlist]) {
        // Process Firebase Dynamic Links
        FIRDynamicLink *dynamicLink = [[FIRDynamicLinks dynamicLinks] dynamicLinkFromCustomSchemeURL:url];
        NSURL *firebaseUrl = [FIRUtilities extractURL:dynamicLink];
        if (firebaseUrl != nil) {
            openUrl = firebaseUrl;
        }
    }

    return [[JitsiMeet sharedInstance] application:app
                                           openURL:openUrl
                                           options:options];
}

@end
