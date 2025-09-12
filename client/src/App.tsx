import { Switch, Route, Redirect } from "wouter";
import { AppProvider, useApp } from "./context/app-context";
import { NotificationProvider } from "./context/notification-context";
import { BottomNavigation } from "./components/layout/bottom-navigation";
import { TopBar } from "./components/layout/top-bar";
import { QuizModal } from "./components/modals/quiz-modal";
import Home from "./pages/home";
import Onboarding from "./pages/onboarding";
import Bible from "./pages/bible";
import Hymnal from "./pages/hymnal";
import Notes from "./pages/notes";
import Store from "./pages/store";
import Settings from "./pages/settings";
import Quiz from "./pages/quiz";
import Calendar from "./pages/calendar";
import Devotional from "./pages/devotional";
import Checkout from "./pages/checkout";

function AppContent() {
  const { user } = useApp();

  // Show onboarding if user hasn't completed setup
  if (!user) {
    return <Onboarding />;
  }

  return (
    <>
      <TopBar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/bible" component={Bible} />
        <Route path="/hymnal" component={Hymnal} />
        <Route path="/notes" component={Notes} />
        <Route path="/store" component={Store} />
        <Route path="/settings" component={Settings} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/devotional" component={Devotional} />
        <Route path="/checkout" component={Checkout} />
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
      
      <BottomNavigation />
      <QuizModal />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AppProvider>
  );
}

export default App;
