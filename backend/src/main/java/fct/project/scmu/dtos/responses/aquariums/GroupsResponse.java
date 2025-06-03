package fct.project.scmu.dtos.responses.aquariums;

import lombok.*;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString(doNotUseGetters = true)
public class GroupsResponse {

    String groupId;

    String groupName;

    List<String> aquariumIds;
}
