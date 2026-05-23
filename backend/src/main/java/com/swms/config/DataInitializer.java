package com.swms.config;

import com.swms.model.*;
import com.swms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final String DEMO_PROJECT_1 = "Retail POS Modernization";
    private static final String DEMO_PROJECT_2 = "Marketing Website Redesign";

    @Autowired private UserRepository userRepository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private TaskRepository taskRepository;
    @Autowired private TaskDependencyRepository taskDependencyRepository;
    @Autowired private ActivityLogRepository activityLogRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        seedUserIfMissingOrInactive("admin@swms.com", "Admin User", User.Role.ADMIN, "admin123");
        seedUserIfMissingOrInactive("manager@swms.com", "Alex Morgan", User.Role.MANAGER, "manager123");
        seedUserIfMissingOrInactive("dev@swms.com", "Jordan Lee", User.Role.EMPLOYEE, "dev123");
        seedUserIfMissingOrInactive("sarah.chen@swms.com", "Sarah Chen", User.Role.EMPLOYEE, "sarah123");
        seedUserIfMissingOrInactive("james.wilson@swms.com", "James Wilson", User.Role.EMPLOYEE, "james123");

        if (projectRepository.findAll().stream().anyMatch(p -> DEMO_PROJECT_1.equals(p.getName()))) {
            return;
        }

        User admin = requireUser("admin@swms.com");
        User manager = requireUser("manager@swms.com");
        User dev = requireUser("dev@swms.com");
        User sarah = requireUser("sarah.chen@swms.com");
        User james = requireUser("james.wilson@swms.com");

        seedRetailPosProject(manager, dev, sarah, james);
        seedMarketingWebsiteProject(admin, manager, dev, sarah, james);
    }

    private void seedRetailPosProject(User manager, User dev, User sarah, User james) {
        Set<User> members = Set.of(manager, dev, sarah, james);
        Project project = projectRepository.save(Project.builder()
            .name(DEMO_PROJECT_1)
            .description(
                "Cloud migration of the legacy point-of-sale platform for 120 retail stores. "
                    + "Includes payment gateway integration, staff training rollout, and phased UAT before production.")
            .status(Project.Status.ACTIVE)
            .owner(manager)
            .members(new HashSet<>(members))
            .build());

        LocalDate today = LocalDate.now();

        Task requirements = saveTask(project, manager,
            "Requirements workshop with store managers",
            "Facilitate workshops across regions to capture POS workflows, hardware constraints, and reporting needs.",
            Task.Status.DONE, Task.Priority.HIGH, dev, today.minusDays(21), 0);

        Task apiSchema = saveTask(project, manager,
            "API schema & integration contracts",
            "Define REST contracts for inventory sync, receipts, and loyalty program hooks with third-party vendors.",
            Task.Status.DONE, Task.Priority.HIGH, sarah, today.minusDays(14), 0);

        Task paymentGateway = saveTask(project, manager,
            "Payment gateway integration",
            "Integrate Stripe terminals and reconcile settlement files nightly. Blocked until schema is signed off.",
            Task.Status.IN_PROGRESS, Task.Priority.CRITICAL, dev, today.plusDays(7), 1);

        Task training = saveTask(project, manager,
            "Staff training materials & runbooks",
            "Produce video walkthroughs, quick-reference cards, and escalation runbooks for floor supervisors.",
            Task.Status.TODO, Task.Priority.MEDIUM, james, today.plusDays(18), 2);

        Task uat = saveTask(project, manager,
            "UAT sign-off (pilot stores)",
            "Run two-week pilot in 8 stores; collect defect log and obtain operations sign-off.",
            Task.Status.TODO, Task.Priority.HIGH, manager, today.plusDays(28), 3);

        Task rollout = saveTask(project, manager,
            "Production rollout — wave 1 (40 stores)",
            "Deploy release train to first 40 locations with rollback playbook and on-call coverage.",
            Task.Status.TODO, Task.Priority.CRITICAL, dev, today.plusDays(42), 4);

        addDependency(paymentGateway, apiSchema, TaskDependency.DependencyType.FINISH_TO_START);
        addDependency(training, paymentGateway, TaskDependency.DependencyType.FINISH_TO_START);
        addDependency(uat, training, TaskDependency.DependencyType.FINISH_TO_START);
        addDependency(rollout, uat, TaskDependency.DependencyType.FINISH_TO_START);
        addDependency(apiSchema, requirements, TaskDependency.DependencyType.FINISH_TO_START);

        seedActivityLogs(project, manager, Map.of(
            ActivityLog.ActionType.PROJECT_CREATED, "Demo project seeded for client presentation",
            ActivityLog.ActionType.PROJECT_MEMBER_ADDED, "Team assigned: Jordan, Sarah, James",
            ActivityLog.ActionType.TASK_CREATED, "Initial sprint backlog created (6 tasks)",
            ActivityLog.ActionType.TASK_STATUS_CHANGED, "Payment gateway integration moved to In Progress",
            ActivityLog.ActionType.DEPENDENCY_ADDED, "Rollout chain: requirements → API → payments → training → UAT → rollout"
        ));
    }

    private void seedMarketingWebsiteProject(User admin, User manager, User dev, User sarah, User james) {
        Set<User> members = Set.of(manager, dev, sarah, james);
        Project project = projectRepository.save(Project.builder()
            .name(DEMO_PROJECT_2)
            .description(
                "Full redesign of the corporate marketing site: new brand system, headless CMS, "
                    + "SEO improvements, and HubSpot lead-capture integration for the Q3 campaign launch.")
            .status(Project.Status.ACTIVE)
            .owner(admin)
            .members(new HashSet<>(members))
            .build());

        LocalDate today = LocalDate.now();

        Task kickoff = saveTask(project, admin,
            "Stakeholder kickoff & success metrics",
            "Align marketing, sales, and legal on KPIs: organic traffic, demo requests, and page performance budgets.",
            Task.Status.DONE, Task.Priority.MEDIUM, manager, today.minusDays(30), 0);

        Task brandReview = saveTask(project, admin,
            "Brand guidelines review",
            "Audit color, typography, and illustration rules; deliver component tokens for dev handoff.",
            Task.Status.DONE, Task.Priority.HIGH, sarah, today.minusDays(20), 0);

        Task homepage = saveTask(project, admin,
            "Homepage & product page mockups",
            "High-fidelity Figma screens for homepage, pricing, and customer stories with mobile breakpoints.",
            Task.Status.IN_PROGRESS, Task.Priority.HIGH, sarah, today.plusDays(5), 1);

        Task cmsMigration = saveTask(project, admin,
            "Headless CMS migration",
            "Migrate 180 pages from WordPress to Contentful; set up preview webhooks and redirect map.",
            Task.Status.IN_PROGRESS, Task.Priority.CRITICAL, dev, today.plusDays(12), 1);

        Task seoAudit = saveTask(project, admin,
            "Technical SEO audit",
            "Fix meta templates, structured data, sitemap, and Core Web Vitals regressions on key landing pages.",
            Task.Status.TODO, Task.Priority.MEDIUM, james, today.plusDays(16), 2);

        Task analytics = saveTask(project, admin,
            "Analytics & conversion dashboard",
            "Wire GA4 + HubSpot events; build Looker dashboard for funnel drop-off by traffic source.",
            Task.Status.TODO, Task.Priority.LOW, dev, today.plusDays(25), 3);

        Task launch = saveTask(project, admin,
            "Go-live & campaign launch",
            "Coordinate DNS cutover, press release, and paid media landing pages for launch week.",
            Task.Status.TODO, Task.Priority.CRITICAL, manager, today.plusDays(35), 4);

        addDependency(homepage, brandReview, TaskDependency.DependencyType.FINISH_TO_START);
        addDependency(cmsMigration, brandReview, TaskDependency.DependencyType.FINISH_TO_START);
        addDependency(seoAudit, cmsMigration, TaskDependency.DependencyType.FINISH_TO_START);
        addDependency(analytics, seoAudit, TaskDependency.DependencyType.FINISH_TO_START);
        addDependency(launch, homepage, TaskDependency.DependencyType.FINISH_TO_START);
        addDependency(launch, analytics, TaskDependency.DependencyType.FINISH_TO_START);

        seedActivityLogs(project, admin, Map.of(
            ActivityLog.ActionType.PROJECT_CREATED, "Marketing redesign initiative started",
            ActivityLog.ActionType.TASK_ASSIGNED, "Sarah Chen leading design track; Jordan Lee on CMS",
            ActivityLog.ActionType.TASK_STATUS_CHANGED, "CMS migration and homepage mockups in parallel",
            ActivityLog.ActionType.DEPENDENCY_ADDED, "Launch depends on analytics + approved homepage designs"
        ));
    }

    private Task saveTask(Project project, User createdBy, String title, String description,
                          Task.Status status, Task.Priority priority, User assignee,
                          LocalDate dueDate, int position) {
        return taskRepository.save(Task.builder()
            .title(title)
            .description(description)
            .status(status)
            .priority(priority)
            .project(project)
            .assignedUser(assignee)
            .createdBy(createdBy)
            .dueDate(dueDate)
            .position(position)
            .build());
    }

    private void addDependency(Task task, Task dependsOn, TaskDependency.DependencyType type) {
        taskDependencyRepository.save(TaskDependency.builder()
            .task(task)
            .dependsOnTask(dependsOn)
            .type(type)
            .build());
    }

    private void seedActivityLogs(Project project, User actor, Map<ActivityLog.ActionType, String> entries) {
        entries.forEach((action, details) -> activityLogRepository.save(ActivityLog.builder()
            .action(action)
            .entityType("Project")
            .entityId(project.getId())
            .details(details)
            .user(actor)
            .project(project)
            .build()));
    }

    private User requireUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalStateException("Demo user missing: " + email));
    }

    private void seedUserIfMissingOrInactive(String email, String name, User.Role role, String rawPassword) {
        var existing = userRepository.findByEmail(email).orElse(null);
        if (existing == null) {
            userRepository.save(User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .role(role)
                .active(true)
                .build());
            return;
        }

        existing.setActive(true);
        existing.setName(name);
        existing.setPassword(passwordEncoder.encode(rawPassword));
        existing.setRole(role);
        userRepository.save(existing);
    }
}
