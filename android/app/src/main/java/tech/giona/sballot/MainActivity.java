package tech.giona.sballot;

import android.content.res.Configuration;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.widget.Toast;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    
    
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);

    WebSettings webSettings = this.bridge.getWebView().getSettings();
    String userAgent = webSettings.getUserAgentString();
    if (newConfig.uiMode == Configuration.UI_MODE_NIGHT_YES + 1) {
      if (!userAgent.contains(" AndroidDarkMode")) userAgent = userAgent + " AndroidDarkMode";
    } else {
      userAgent = userAgent.replace(" AndroidDarkMode", "");
    }
    webSettings.setUserAgentString(userAgent);

  }

  @Override
  public void onStart() {
    super.onStart();
    // Android fix for enabling dark mode
    int nightModeFlags = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
    WebSettings webSettings = this.bridge.getWebView().getSettings();
    if (nightModeFlags == Configuration.UI_MODE_NIGHT_YES) {
      String userAgent = webSettings.getUserAgentString();
      userAgent = userAgent + " AndroidDarkMode";
      webSettings.setUserAgentString(userAgent);
    }
  }

}
